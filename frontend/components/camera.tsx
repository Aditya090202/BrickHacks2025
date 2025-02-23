import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect } from "react";

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
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${props.id}`);
    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };
    const videoElement = document.querySelector("video");
    const captureFrame = () => {
      if (!videoElement) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(videoElement, 0, 0);
        const frame = canvas.toDataURL("image/jpeg", 0.8);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(frame);
        }
      }
    };

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        captureFrame();
      }
    }, 5000);

    // Cleanup function
    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [props.id]); // Dependency array with props.id

  return (
    <motion.div
      key={props.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: props.index * 0.1 }}
      className="group relative rounded-xl overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-purple-500/50 transition-all"
    >
      <div className="aspect-video relative">
        <video
          src={props.video}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => props.setSelectedCamera(props)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

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
