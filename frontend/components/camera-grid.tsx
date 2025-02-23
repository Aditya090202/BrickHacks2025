"use client";

import { useState } from "react";
import { VideoModal } from "@/components/video-modal";
import { Camera } from "./camera";

const cameras = [
  {
    id: "cam-001",
    name: "Dashcam 1",
    location: "Rajesh Jewellers, Mumbai",
    status: "active",
    video: "/videos/car.mp4",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-002",
    name: "Dashcam 2",
    location: "Speed Zone Motorsports, Charlotte",
    status: "active",
    video: "/videos/car.mp4",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  // {
  //   id: "cam-003",
  //   name: "Dashcam 3",
  //   location: "Golden Dreams Jewellery, Delhi",
  //   status: "active",
  //   video: "/videos/car.mp4",
  //   image:
  //     "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  // },
  // {
  //   id: "cam-004",
  //   name: "Dashcam 4",
  //   location: "Central Warehouse, Singapore",
  //   status: "active",
  //   video: "/videos/car.mp4",
  //   image:
  //     "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  // },
];

interface CameraGridProps {
  searchQuery: string;
}

export function CameraGrid({ searchQuery }: CameraGridProps) {
  const [selectedCamera, setSelectedCamera] = useState<
    (typeof cameras)[0] | null
  >(null);

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {filteredCameras.map((camera, index) => (
          <Camera
            key={camera.id}
            {...camera}
            index={index}
            setSelectedCamera={setSelectedCamera}
          />
        ))}
      </div>

      <VideoModal
        isOpen={!!selectedCamera}
        onClose={() => setSelectedCamera(null)}
        camera={selectedCamera}
      />
    </>
  );
}
