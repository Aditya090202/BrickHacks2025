"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { motion } from "framer-motion"

const videos = [
  {
    id: "vid-001",
    name: "Main Entrance - Incident #127",
    date: "2024-02-22",
    duration: "00:15:30",
    thumbnail: "/placeholder.svg",
  },
  // Add more videos as needed
]

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVideos = videos.filter((video) => video.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <TopNav onSearch={setSearchQuery} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Video Library</h1>
          <p className="text-slate-400">Browse and manage your uploaded videos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative rounded-xl overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-purple-500/50 transition-all"
            >
              <div className="aspect-video relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{video.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <span>{video.date}</span>
                    <span>•</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

