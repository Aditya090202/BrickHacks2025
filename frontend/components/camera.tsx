import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { Toaster, toast } from "sonner";

export interface CameraProps {
  id: string;
  name: string;
  location: string;
  status: string;
  video: string;
  image: string;
  index: number;
  setSelectedCamera: (camera: CameraProps | null) => void;
}

export function Camera(props: CameraProps) {
  // if crash detected -> send alert
  const crashCountRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const modelRef = useRef<cocossd.ObjectDetection | null>(null);
  const frameCountRef = useRef(0);
  const previousPredictionsRef = useRef<cocossd.DetectedObject[]>([]);

  const detectCrash = (
    currentPredictions: cocossd.DetectedObject[],
    previousPredictions: cocossd.DetectedObject[]
  ) => {
    const threshold = 45650; // Adjust this value based on your needs
    for (const current of currentPredictions) {
      const previous = previousPredictions.find(
        (p) => p.class === current.class
      );
      if (previous) {
        const [x1, y1, w1, h1] = current.bbox;
        const [x2, y2, w2, h2] = previous.bbox;
        const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
        const sizeDiff = Math.abs(w1 * h1 - w2 * h2);
        if (distance > threshold || sizeDiff > threshold) {
          return true;
        }
      }
    }
    return false;
  };

  const detectObjects = useCallback(
    async (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
      if (modelRef.current) {
        const predictions = await modelRef.current.detect(img, undefined, 0.4);
        const vehiclePredictions = predictions.filter((pred) =>
          ["car", "truck", "bus", "motorcycle"].includes(pred.class)
        );

        const isCrash = detectCrash(
          vehiclePredictions,
          previousPredictionsRef.current
        );
        if (isCrash) {
          crashCountRef.current += 1;

          // console.log(props.id, crashCountRef.current);
          if (crashCountRef.current === 7) {
            const currentTime = new Date().toISOString();
            // console.log(
            //   `Crash detected on camera ${props.id} at ${currentTime}`
            // );
            toast.error(
              `Crash detected on camera ${props.id} at ${currentTime}`
            );
            const crashData = {
              action_type: "crash_detected",
              crash_id: `crash_${props.id}`, // id of camera
              timestamp: currentTime,
            };

            fetch("http://localhost:8000/process_input/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(crashData),
            })
              .then((response) => response.json())
              .then((data) => console.log("Crash data processed:", data))
              .catch((error) =>
                console.error("Error sending crash data:", error)
              );
          }
          //       /*
          //       const stuff = {
          //   action_type: "crash_detected",
          //   crash_id: "crash_67832130",
          //   timestamp: "2025-02-22T12:34:56",
          // }; */
          //       console.log(seenTurn, thisTurn);
          //     } else {
          //       console.log("Seen turn doing nothing");
          //     }
        }

        previousPredictionsRef.current = vehiclePredictions;

        vehiclePredictions.forEach((prediction) => {
          ctx.strokeStyle = isCrash ? "red" : "green";
          ctx.lineWidth = 2;
          ctx.strokeRect(...prediction.bbox);

          ctx.fillStyle = isCrash ? "red" : "green";
          ctx.font = "16px Arial";
          ctx.fillText(
            `${prediction.class} ${Math.round(prediction.score * 100)}%`,
            prediction.bbox[0],
            prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
          );
        });
      }
    },
    [props.id]
  );

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      await tf.setBackend("webgl");
      modelRef.current = await cocossd.load({
        base: "mobilenet_v2",
      });
    };
    loadModel();

    const websocket = new WebSocket(`ws://localhost:8000/ws/${props.id}`);

    websocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.new) {
        // console.log("here");
        crashCountRef.current = 0;
      }
      frameCountRef.current += 1;
      if (frameCountRef.current % 3 !== 0) return; // Process every 3rd frame

      const imgSrc = `data:image/jpeg;base64,${data.frame}`;

      const img = new Image();
      img.onload = async () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);

            await detectObjects(img, ctx);

            // Draw gradient overlay
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "rgba(0,0,0,0)");
            gradient.addColorStop(1, "rgba(0,0,0,0.5)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      };
      img.src = imgSrc;
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [props.id, detectObjects]);

  return (
    <motion.div
      key={props.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: props.index * 0.1 }}
      className="group relative rounded-xl overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-purple-500/50 transition-all"
    >
      <div className="aspect-video relative">
        <canvas ref={canvasRef} className="w-full h-auto" />

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white mb-1">
            {props.name}
          </h3>
          <p className="text-sm text-slate-300">{props.location}</p>
        </div>
      </div>
    </motion.div>
  );
}
