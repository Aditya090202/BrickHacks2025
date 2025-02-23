"use client";

import { useState } from "react";
import { TopNav } from "@/components/top-nav";
import { CameraGrid } from "@/components/camera-grid";
import { Sidebar } from "@/components/sidebar";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
      <TopNav onSearch={setSearchQuery} />
      <div className="flex gap-6 p-6">
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              Security Overview
            </h1>
            <p className="text-slate-400">
              Monitoring active cameras across multiple locations
            </p>
          </div>
          <CameraGrid searchQuery={searchQuery} />
        </main>
        <Sidebar />
      </div>
    </div>
  );
}
