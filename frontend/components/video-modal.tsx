"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  camera: {
    id: string
    name: string
    location: string
  } | null
}

export function VideoModal({ isOpen, onClose, camera }: VideoModalProps) {
  if (!camera) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[90vw] p-0 bg-slate-900 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-8 z-50 h-8 w-8 rounded-full bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/75"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </Button>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl text-white">{camera.name}</DialogTitle>
          <p className="text-sm text-slate-400">{camera.location}</p>
        </DialogHeader>
        <div className="relative aspect-video mt-6">
          {/* Video player will be integrated here */}
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            <p className="text-slate-400">Loading video stream...</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

