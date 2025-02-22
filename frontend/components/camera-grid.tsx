"use client"

import { useState } from "react"
import { Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { VideoModal } from "@/components/video-modal"

const cameras = [
  {
    id: "cam-001",
    name: "Main Entrance",
    location: "Rajesh Jewellers, Mumbai",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-002",
    name: "Parking Lot A",
    location: "Speed Zone Motorsports, Charlotte",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-003",
    name: "Retail Floor",
    location: "Golden Dreams Jewellery, Delhi",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-004",
    name: "Loading Dock",
    location: "Central Warehouse, Singapore",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-005",
    name: "Parking Lot B",
    location: "Speed Zone Motorsports, Charlotte",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-006",
    name: "Side Entrance",
    location: "Rajesh Jewellers, Mumbai",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-007",
    name: "Storage Area",
    location: "Golden Dreams Jewellery, Delhi",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-008",
    name: "Vehicle Gate",
    location: "Central Warehouse, Singapore",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-009",
    name: "Staff Entrance",
    location: "Speed Zone Motorsports, Charlotte",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
  {
    id: "cam-010",
    name: "Security Post",
    location: "Central Warehouse, Singapore",
    status: "active",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhlVxW6VZrWcl5j1fKTh9ZlH9BC4E5.png",
  },
]

interface CameraGridProps {
  searchQuery: string
}

export function CameraGrid({ searchQuery }: CameraGridProps) {
  const [selectedCamera, setSelectedCamera] = useState<(typeof cameras)[0] | null>(null)

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCameras.map((camera, index) => (
          <motion.div
            key={camera.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative rounded-xl overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-purple-500/50 transition-all"
          >
            <div className="aspect-video relative">
              <img src={camera.image || "/placeholder.svg"} alt={camera.name} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setSelectedCamera(camera)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold text-white mb-1">{camera.name}</h3>
                <p className="text-sm text-slate-300">{camera.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <VideoModal isOpen={!!selectedCamera} onClose={() => setSelectedCamera(null)} camera={selectedCamera} />
    </>
  )
}

