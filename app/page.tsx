"use client";

import { useAgent } from "./hooks/useAgent";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ProcessingIndicator } from "./components/ProcessingIndicator";
import { Timeline } from "./components/Timeline";
import { ChatInterface } from "./components/ChatInterface";
import { DCARecord, ProcessingStatus, ChatMessage } from "./types";
import { processDocument } from "./utils/upstageApi";

function App() {
  const [input, setInput] = useState("");
  const {
    messages: agentMessages,
    sendMessage: sendAgentMessage,
    isThinking,
  } = useAgent();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "records">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [records, setRecords] = useState<DCARecord[]>([
    {
      id: "1",
      type: "current",
      asset: "BTC",
      amount: 100,
      frequency: "weekly",
      status: "active",
      date: "2024-03-20",
      details: {
        "Next DCA": "2024-03-27",
        "Total Invested": "$1,200",
        "Average Price": "$45,000",
      },
    },
    {
      id: "2",
      type: "past",
      asset: "ETH",
      amount: 50,
      frequency: "monthly",
      status: "completed",
      date: "2024-02-15",
      details: {
        "Total Invested": "$600",
        "Average Price": "$2,800",
        ROI: "+15%",
      },
    },
    {
      id: "3",
      type: "upcoming",
      asset: "SOL",
      amount: 75,
      frequency: "daily",
      status: "scheduled",
      date: "2024-03-25",
      details: {
        "Start Date": "2024-03-25",
        Duration: "30 days",
        "Total Amount": "$2,250",
      },
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I can help you manage and analyze your DCA strategies. Ask me about setting up new DCA schedules or analyzing your current investments.",
      timestamp: new Date(),
    },
  ]);

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
  });

  // Update chat messages when agent messages change
  useEffect(() => {
    if (agentMessages.length > 0) {
      const newMessages = agentMessages.map((msg, index) => ({
        id: `agent-${Date.now()}-${index}`,
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
        timestamp: new Date(),
      }));
      setChatMessages((prev) => {
        // Keep the initial greeting and add new messages
        const initialMessage = prev.find((m) => m.id === "1");
        return initialMessage ? [initialMessage, ...newMessages] : newMessages;
      });
    }
  }, [agentMessages]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setProcessingStatus({
      isProcessing: true,
      status: "Analyzing document...",
      progress: 0,
    });

    try {
      setProcessingStatus((prev) => ({
        ...prev,
        status: "Uploading document...",
        progress: 20,
      }));

      const result = await processDocument(file);

      setProcessingStatus((prev) => ({
        ...prev,
        status: "Processing OCR results...",
        progress: 60,
      }));

      const formattedText = result.text.split("\\n").join("\n");

      // Send the extracted text to the AI agent
      await sendAgentMessage(`${formattedText}`);

      setProcessingStatus((prev) => ({
        ...prev,
        status: "Completing analysis...",
        progress: 90,
      }));
    } catch (error) {
      console.error("Error processing document:", error);
      setProcessingStatus((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to process document. Please try again.",
        progress: 100,
      }));
    } finally {
      setProcessingStatus({ isProcessing: false });
    }
  };

  const handleSendMessage = async (content: string) => {
    await sendAgentMessage(content);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto h-[calc(100vh-16rem)] flex flex-col">
          <ProcessingIndicator status={processingStatus} />
          <div className="flex-1 relative">
            {activeTab === "chat" ? (
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onFileUpload={handleFileUpload}
                isProcessing={isThinking || processingStatus.isProcessing}
              />
            ) : (
              <Timeline records={records} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
