import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6">
      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

