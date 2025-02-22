"use client"

import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer } from "@/components/ui/chart"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <TopNav />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Monitor and analyze security incidents</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Dangerous Moments by Video</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "stream.mp4", value: 3 },
                    { name: "camera2.mp4", value: 2 },
                    { name: "entrance.mp4", value: 4 },
                  ]}
                >
                  <Bar dataKey="value" fill="rgb(168, 85, 247)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Dangerous vs Non-Dangerous Moments</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Dangerous", value: 30 },
                      { name: "Non-Dangerous", value: 70 },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    fill="rgb(168, 85, 247)"
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Danger Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { time: "00:00", incidents: 1 },
                    { time: "00:05", incidents: 1.5 },
                    { time: "00:10", incidents: 1.8 },
                    { time: "00:15", incidents: 2 },
                  ]}
                >
                  <Line dataKey="incidents" stroke="rgb(168, 85, 247)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Video Key Moments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-700">
              <div className="grid grid-cols-3 gap-4 p-4 text-slate-200 font-medium">
                <div>Video Name</div>
                <div>Timestamp</div>
                <div>Description</div>
              </div>
              <div className="divide-y divide-slate-700">
                <div className="grid grid-cols-3 gap-4 p-4 text-slate-300">
                  <div>stream.mp4</div>
                  <div>00:01</div>
                  <div>A person is speaking directly to the camera.</div>
                </div>
                {/* Add more rows as needed */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

