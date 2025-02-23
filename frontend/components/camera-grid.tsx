"use client";

import { useState } from "react";
import { VideoModal } from "@/components/video-modal";
import { Camera } from "./camera";
import { Sidebar } from "./sidebar";

const cameras = [
  {
    id: "cam-001",
    name: "cam-001",
    location: "New York City, New York",
    status: "active",
    video: "/videos/car.mp4",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-002",
    name: "cam-002",
    location: "Buffalo, New York",
    status: "active",
    video: "/videos/car.mp4",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-003",
    name: "cam-003",
    location: "RIT, Rochester",
    status: "active",
    video: "/videos/car.mp4",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:mx-auto [&>*:last-child:nth-child(odd)]:w-[calc(50%-0.5rem)]">
        {filteredCameras.map((camera, index) => (
          <Camera
            key={camera.id}
            {...camera}
            index={index}
            setSelectedCamera={setSelectedCamera}
          />
        ))}
      </div>
      {/* <VideoModal
        isOpen={!!selectedCamera}
        onClose={() => setSelectedCamera(null)}
        camera={selectedCamera}
      /> */}
    </>
  );
}
