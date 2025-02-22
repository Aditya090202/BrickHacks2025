"use client"

import type React from "react"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { Upload } from "lucide-react"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = ["video/mp4", "video/webm", "video/ogg"]
      return validTypes.includes(file.type)
    })

    if (validFiles.length !== files.length) {
      alert("Some files were rejected. Only video files (MP4, WebM, OGG) are allowed.")
    }

    // Handle valid files here
    console.log("Valid files:", validFiles)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <TopNav />
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Upload Videos</h1>
          <p className="text-slate-400">Upload your security footage for analysis</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center ${
            dragActive ? "border-purple-500 bg-purple-500/10" : "border-slate-700 hover:border-purple-500/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-slate-400" />
            <div>
              <p className="text-lg font-medium text-white">Drag and drop your videos here</p>
              <p className="text-sm text-slate-400 mt-1">Supports MP4, WebM, and OGG formats</p>
            </div>
            <label className="relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleFileChange}
                multiple
              />
              <span className="inline-flex h-10 items-center justify-center rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Browse files
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

