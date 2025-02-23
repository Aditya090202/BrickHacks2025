import { Bell, Camera, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0B0F1A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0F1A]/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="transition-transform group-hover:scale-105">
              <Logo />
            </div>
            {/* <Camera className="h-8 w-8 text-[#8B46FF]" /> */}
            <div>
              <h1 className="text-lg font-semibold text-[#8B46FF]">
                SAFETRACK
              </h1>
              <p className="text-xs text-gray-400">Intelligent Surveillance</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                className="w-[300px] bg-gray-900/50 pl-10 text-gray-300 placeholder:text-gray-500"
                placeholder="Search cameras..."
              />
            </div>
            <Button size="icon" variant="ghost" className="relative">
              <Bell className="h-5 w-5 text-gray-300" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#8B46FF]" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Welcome to Intelligent Security Monitoring
            </h2>
            <p className="text-lg text-gray-400">
              Monitor and manage your security cameras across multiple locations
              with our advanced AI-powered surveillance system.
            </p>
            <div className="flex gap-4">
              <Link href="/">
                <Button className="bg-[#8B46FF] hover:bg-[#8B46FF]/90">
                  Get Started
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-gray-700 hover:bg-gray-800"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900/30 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">System Status</h3>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-400">
                  All Systems Operational
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between rounded-lg bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  <Camera className="h-5 w-5 text-[#8B46FF]" />
                  <span>Cameras Online</span>
                </div>
                <span className="text-[#8B46FF]">3/3</span>
              </div>
              <div className="rounded-lg bg-gray-800/50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium">Ask Recent Incidents</h4>
                </div>
                <div className="relative">
                  <Input
                    className="bg-gray-900/50 pr-10 text-gray-300 placeholder:text-gray-500"
                    placeholder="Ask about security incidents..."
                  />
                  <Button
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 transform bg-[#8B46FF] hover:bg-[#8B46FF]/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 transition-all hover:border-[#8B46FF]/50 hover:shadow-lg hover:shadow-[#8B46FF]/20">
            <h3 className="text-xl font-semibold mb-4">Real-time Monitoring</h3>
            <p className="text-gray-400">
              Stay vigilant with our advanced real-time surveillance system.
            </p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 transition-all hover:border-[#8B46FF]/50 hover:shadow-lg hover:shadow-[#8B46FF]/20">
            <h3 className="text-xl font-semibold mb-4">AI-Powered Insights</h3>
            <p className="text-gray-400">
              Leverage cutting-edge AI to detect and prevent security threats.
            </p>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 transition-all hover:border-[#8B46FF]/50 hover:shadow-lg hover:shadow-[#8B46FF]/20">
            <h3 className="text-xl font-semibold mb-4">Seamless Integration</h3>
            <p className="text-gray-400">
              Easily integrate with your existing security infrastructure.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
