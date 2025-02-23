"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Activity,
  Library,
  BarChart2,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";

interface TopNavProps {
  onSearch?: (query: string) => void;
}

export function TopNav({ onSearch }: TopNavProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-slate-800">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="transition-transform group-hover:scale-105">
              <Logo />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                SENTINEL
              </span>
              <span className="text-xs text-slate-400">
                Intelligent Surveillance
              </span>
            </div>
          </Link>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search cameras..."
              className="pl-10 bg-slate-800/50 border-slate-700 focus:border-purple-500"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* <nav className="flex items-center gap-4">
            {[
              { icon: Activity, label: "Live", path: "/" },
              { icon: Upload, label: "Upload", path: "/upload" },
              { icon: Library, label: "Library", path: "/library" },
              { icon: BarChart2, label: "Analytics", path: "/analytics" },
            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-5 w-5" />
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </nav> */}

          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-800">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
            </Button>

            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>DT</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
