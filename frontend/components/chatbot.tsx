"use client";

import type React from "react";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AskIncidents() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I've analyzed the security footage. How can I help you with the incident reports?",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="rounded-lg bg-[#0B0D13] p-4 space-y-4">
      <h2 className="text-xl font-semibold text-white">Ask Recent Incidents</h2>
      <div className="h-[200px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === "assistant"
                  ? "bg-[#1A1D24] text-gray-200"
                  : "bg-[#2A2D34] text-gray-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about security incidents..."
          className="flex-1 bg-[#1A1D24] border-0 text-gray-200 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-purple-500"
        />
        <Button
          type="submit"
          size="icon"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          <SendHorizontal className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
