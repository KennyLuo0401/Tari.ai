"use client";

import { useAgent } from "./hooks/useAgent";
import { useDCAStatus } from "./hooks/useDCAStatus";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ProcessingIndicator } from "./components/ProcessingIndicator";
import { Timeline } from "./components/Timeline";
import { ChatInterface } from "./components/ChatInterface";
import { ProcessingStatus, ChatMessage, UpstageResponse } from "./types";
import { processDocument } from "./utils/upstageApi";

function App() {
  const [input, setInput] = useState("");
  const { messages: agentMessages, sendMessage: sendAgentMessage, isThinking } = useAgent();
  const { records, isLoading: isDCALoading, error: dcaError } = useDCAStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "records">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I can help you manage and analyze your DCA strategies. Ask me about setting up new DCA schedules or analyzing your current investments.",
      timestamp: new Date(),
    },
  ]);

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
  });

  useEffect(() => {
    if (agentMessages.length > 0) {
      const newMessages = agentMessages.map((msg, index) => ({
        id: `agent-${Date.now()}-${index}`,
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
        timestamp: new Date(),
      }));
      //@ts-ignore
      setChatMessages((prev) => {
        const initialMessage = prev.find(m => m.id === "1");
        return initialMessage ? [initialMessage, ...newMessages] : newMessages;
      });
    }
  }, [agentMessages]);

  const extractTextFromHtml = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

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
      
      // Extract text directly from content.text if available
      const textContent = result.content.text || 
        // Fallback to processing HTML content if text is not available
        result.elements
          .map(element => extractTextFromHtml(element.content.html))
          .join('\n')
          .trim();

      // Split text into separate commands based on numbered or lettered lines
      const commands = textContent
        .split(/(?:\d+\.|[A-Za-z]\.|[IVXLCDM]+\.)/)  // Matches "1.", "a.", "X.", "IV.", etc.
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);

      if (commands.length > 0) {
        for (let i = 0; i < commands.length; i++) {
          setProcessingStatus((prev) => ({
            ...prev,
            status: `Processing command ${i + 1} of ${commands.length}...`,
            progress: ((i + 1) / commands.length) * 100,
          }));

          await sendAgentMessage(commands[i]);

          // Add a small delay between commands
          if (i < commands.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      setProcessingStatus((prev) => ({
        ...prev,
        status: "Processing complete",
        progress: 100,
      }));
    } catch (error) {
      console.error("Error processing document:", error);
      setProcessingStatus((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to process document. Please try again.",
        progress: 100,
      }));
    } finally {
      setTimeout(() => {
        setProcessingStatus({ isProcessing: false });
      }, 1000);
    }
  };

  const handleSendMessage = async (content: string) => {
    await sendAgentMessage(content);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
          {processingStatus.isProcessing && <ProcessingIndicator status={processingStatus} />}
          <div className="flex-1 relative">
            {activeTab === "chat" ? (
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onFileUpload={handleFileUpload}
                isProcessing={isThinking || processingStatus.isProcessing}
              />
            ) : (
              <Timeline 
                records={records} 
                isLoading={isDCALoading}
                error={dcaError}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;