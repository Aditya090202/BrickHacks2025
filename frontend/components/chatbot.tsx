"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatOpenAI } from "@langchain/openai";

// Initialize the LLM
const llm = new ChatOpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  temperature: 0.7,
});

const cameras = [
  { "cam-001": "New York City, New York" },
  { "cam-002": "Buffalo, New York" },
  { "cam-003": "RIT, Rochester" },
];

export default function AskIncidents() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const context = await fetch("http://localhost:8000/");
      const contextData = await context.json();
      console.log("context", contextData);
      const response = await llm.invoke([
        {
          role: "system",
          content: `You are Herbert, an AI security analyst for the "SAFETRACK" car accident monitoring website. Your responses must be based solely on the provided context data. Your primary functions are:

1. Analyzing and reporting on security incidents and accidents from the context data.
2. Providing information about recent accidents or security breaches mentioned in the context.
3. Offering insights on security protocols and procedures based on the given information.
4. NEVER MENTION THAT YOU HAVE CONTEXT DATA.

Key traits:
- You're professional and focused on your security duties.
- You refer to yourself as Herbert.
- You only discuss information present in the context data.
- If asked about topics not in the context, politely redirect to relevant information that is available.

Guidelines:
- Only use information explicitly stated in the context data or with the information given about the active cameras and their respective locations.
- If a question can't be answered using the context, politely say so and suggest topics that are covered.
- Provide clear, concise information about security-related inquiries based on the context.
- Do not speculate or infer information not present in the context.

Example response to an off-topic question:
"I apologize, but I don't have information about that in my current context. However, I can provide details about [mention a relevant topic from the context]. Would you like to know more about that?"

Currently there are ${
            cameras.length
          } active cameras. The cameras and their respective cities are ${JSON.stringify(
            cameras
          )}
Remember: A camera can have a crash count of 0 if it is not in the context data.

Context Data:
${JSON.stringify(contextData)}

Please base your response entirely on this context and the user's input. Pretend that you know the context data by heart, and don't mention the word "Context Data". If asked about the time of an accident, convert the time given into human time, to help the user understand what time the accident occured.
When asked about which camera had the latest crash, look at the crash_id of the context data. The camera name would go after the word "crash_" in the crash_id
When asked about safe place, look for the location of the camera with the least amount of crashes. A camera can have total crashes of 0 if its not in the context. Explain why you think its the safest in a quick way.
 `,
        },
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: "user", content: input },
      ]);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.content },
      ]);
    } catch {
      //   console.error("Error calling LLM:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
