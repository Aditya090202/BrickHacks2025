import { Camera, Shield } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const incidents = [
  {
    id: "inc-001",
    type: "Intrusion Alert",
    severity: "high",
    location: "Main Entrance",
    time: "2m ago",
  },
  {
    id: "inc-002",
    type: "Motion Detected",
    severity: "medium",
    location: "Parking Lot",
    time: "5m ago",
  },
]

export function Sidebar() {
  return (
    <div className="w-96 rounded-xl backdrop-blur-sm bg-slate-800/50 border border-slate-700 p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-400" />
                  <span className="font-medium text-white">Cameras Online</span>
                </div>
                <span className="text-sm text-slate-300">10/10</span>
              </div>
              <Progress value={100} className="bg-slate-700 h-1" indicatorClassName="bg-purple-500" />
            </div>

            <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-white">System Health</span>
                </div>
                <span className="text-sm text-slate-300">100%</span>
              </div>
              <Progress value={100} className="bg-slate-700 h-1" indicatorClassName="bg-blue-500" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Incidents</h2>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white">{incident.type}</h3>
                      <span className="text-sm text-slate-400">{incident.time}</span>
                    </div>
                    <p className="text-sm text-slate-300">{incident.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

