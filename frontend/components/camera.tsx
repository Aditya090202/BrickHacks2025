import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Maximize2 } from "lucide-react";

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
  const videoRef = useRef<HTMLImageElement | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(`ws://localhost:8000/ws/${props.id}`);

    websocket.onmessage = (event) => {
      const imgSrc = `data:image/jpeg;base64,${event.data}`;
      if (videoRef.current) {
        videoRef.current.src = imgSrc;
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [props.id]);

  return (
    <motion.div
      key={props.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: props.index * 0.1 }}
      className="group relative rounded-xl overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-purple-500/50 transition-all"
    >
      <div className="aspect-video relative">
        <img ref={videoRef} alt="Live Stream" className="w-full h-auto" />
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
    // <div>
    //   <h3>Live Camera {id}</h3>
    //   <img ref={videoRef} alt="Live Stream" className="w-full h-auto" />
    // </div>
  );
}
