"use client";

import { useAgent } from "./hooks/useAgent";
import React, { useState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  LineChart,
  Shield,
  Wallet,
  Menu,
  X,
  ChevronRight,
  Hexagon,
  ArrowUpRight,
  Activity,
  Bot,
  Coins,
  Square,
  Bell,
  Circle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ProcessingIndicator } from "./components/ProcessingIndicator";
import { Timeline } from "./components/Timeline";
import { ChatInterface } from "./components/ChatInterface";
import { HealthRecord, ProcessingStatus, ChatMessage } from "./types";
import { processDocument } from "./utils/upstageApi";

interface TokenFormData {
  name: string;
  symbol: string;
  initialSupply?: string;
  maxSupply?: string;
  baseUri?: string;
}

interface TokenModalProps {
  type: "ERC20" | "ERC721" | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: "ERC20" | "ERC721", data: TokenFormData) => void;
}

const TokenModal: React.FC<TokenModalProps> = ({
  type,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TokenFormData>({
    name: "",
    symbol: "",
    initialSupply: "",
    maxSupply: "",
    baseUri: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type) {
      onSubmit(type, formData);
      setFormData({
        name: "",
        symbol: "",
        initialSupply: "",
        maxSupply: "",
        baseUri: "",
      });
    }
  };

  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#1a1a1a] rounded-2xl w-full max-w-lg p-8 shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          {type === "ERC20" ? (
            <Coins className="w-6 h-6" />
          ) : (
            <Square className="w-6 h-6" />
          )}
          Create {type} Token
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 mb-1">Token Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., My Token"
              className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1">Token Symbol</label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g., MTK"
              className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none"
              required
            />
          </div>
          {type === "ERC20" ? (
            <div>
              <label className="block text-white/80 mb-1">Initial Supply</label>
              <input
                type="number"
                name="initialSupply"
                value={formData.initialSupply}
                onChange={handleChange}
                placeholder="e.g., 1000000"
                className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-white/80 mb-1">
                  Collection Size (Max Supply)
                </label>
                <input
                  type="number"
                  name="maxSupply"
                  value={formData.maxSupply}
                  onChange={handleChange}
                  placeholder="e.g., 10000"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 mb-1">Base URI</label>
                <input
                  type="text"
                  name="baseUri"
                  value={formData.baseUri}
                  onChange={handleChange}
                  placeholder="e.g., https://api.example.com/metadata/"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:border-white/40 focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all duration-300"
            >
              Deploy Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I can help you analyze and understand patient records. Upload documents directly in our chat or ask me questions about existing records.",
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
      //@ts-ignore
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
