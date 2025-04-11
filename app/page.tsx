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
  const { messages, sendMessage, isThinking } = useAgent();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "records">("chat");
  // Ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      date: "2024-03-15",
      type: "diagnosis",
      description: "Type 2 Diabetes",
      severity: "high",
      details: {
        "A1C Level": "7.8%",
        "Fasting Glucose": "145 mg/dL",
      },
    },
    {
      id: "2",
      date: "2024-03-10",
      type: "medication",
      description: "Metformin 500mg",
      severity: "medium",
      details: {
        Dosage: "500mg",
        Frequency: "Twice daily",
        Duration: "3 months",
      },
    },
    {
      id: "3",
      date: "2024-02-28",
      type: "allergy",
      description: "Penicillin",
      severity: "high",
      details: {
        Reaction: "Severe rash",
        "First Observed": "2024-02-28",
      },
    },
  ]);

  const [messagess, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I can help you analyze and understand patient records. Upload documents directly in our chat or ask me questions about existing records.",
      timestamp: new Date(),
    },
  ]);
  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSendMessage = async () => {
    if (!input.trim() || isThinking) return;
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const navigationItems = [
    { name: "Dashboard", icon: LineChart },
    { name: "Portfolio", icon: Wallet },
    { name: "Risk Analysis", icon: Shield },
  ];

  const suggestionChips = [
    "Show highest APY",
    // "Compare risks",
    "Latest opportunities",
    "Portfolio analysis",
    "Mint ERC-20 Token",
    "Mint ERC-721 NFT",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTokenType, setActiveTokenType] = useState<
    "ERC20" | "ERC721" | null
  >(null);

  const handleSuggestionClick = (suggestion: string) => {
    // setInput(suggestion);

    switch (suggestion) {
      case "Mint ERC-20 Token":
        setActiveTokenType("ERC20");
        setIsModalOpen(true);
        break;
      case "Mint ERC-721 NFT":
        setActiveTokenType("ERC721");
        setIsModalOpen(true);
        break;
      default:
        setInput(suggestion);
    }
  };

  const handleTokenFormSubmit = (
    type: "ERC20" | "ERC721",
    formData: TokenFormData
  ) => {
    console.log(type, formData);
    setIsModalOpen(false);
    setInput(
      `deploy ${type} with name ${formData.name} and symbol ${formData.symbol} and supply  ${formData.initialSupply}`
    );
  };
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
  });

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

      // Format the text with proper line breaks
      const formattedText = result.text.split("\\n").join("\n");

      // Add the OCR result as a system message
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I've analyzed "${
          file.name
        }" and extracted the following text:\n\n${formattedText}\n\nOverall confidence: ${Math.round(
          result.confidence * 100
        )}%`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update processing status
      setProcessingStatus((prev) => ({
        ...prev,
        status: "Completing analysis...",
        progress: 90,
      }));
      await new Promise((resolve) => setTimeout(resolve, 500));
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
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setProcessingStatus({ isProcessing: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I've analyzed the records related to "${content}". Based on the timeline, I can see several important events. Would you like me to focus on any specific aspect?`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    setProcessingStatus({ isProcessing: false });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto h-[calc(100vh-16rem)] flex flex-col">
          <ProcessingIndicator status={processingStatus} />
          <div className="flex-1 relative">
            {activeTab === "chat" ? (
              <ChatInterface
                messages={messagess}
                onSendMessage={handleSendMessage}
                onFileUpload={handleFileUpload}
                isProcessing={processingStatus.isProcessing}
              />
            ) : (
              <Timeline records={records} />
            )}
          </div>
        </div>
      </main> */}

      <main className="flex-1 flex items-center justify-center p-6 pt-15">
        <div className="w-full max-w-4xl h-[calc(100vh-10rem)] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-white/10 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative bg-zinc-900 p-2 rounded-lg">
                  <Bot className="h-5 w-5 text-white group-hover:text-gray-300 transition-colors" />
                </div>
              </div>
              <div>
                <h2 className="font-display text-lg font-medium tracking-tight text-white">
                  Tactical AI
                </h2>
                <p className="text-xs tracking-wider text-zinc-400 uppercase">
                  Fast, brainy portfolio optimization
                </p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto space-y-6 p-8 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } message-enter message-enter-active`}
              >
                <div
                  className={`max-w-[80%] p-6 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:scale-[1.02] ${
                    msg.sender === "user"
                      ? "bg-white text-black ml-8"
                      : "glass text-white/90 mr-8"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="leading-relaxed tracking-wide"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-white/80 hover:text-white underline transition-colors duration-200 ease-in-out"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center space-x-3 text-white/50 pl-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm animate-pulse tracking-wide">
                  Analyzing ...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-6 py-3 glass border-t border-white/[0.02]">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-2">
              {suggestionChips.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isThinking}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all duration-300
            ${
              isThinking
                ? "text-white/30 bg-white/5 cursor-not-allowed"
                : "text-white/60 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95"
            }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 glass">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Ask about tactical rebalancing strategies..."
                className="flex-1 px-4 py-2 bg-zinc-800 text-white placeholder-zinc-400 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all font-body text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
                disabled={isThinking}
              />

              <motion.button
                onClick={onSendMessage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isThinking}
                className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-monochrome"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Token Creation Modal */}
      <TokenModal
        type={activeTokenType}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveTokenType(null);
        }}
        onSubmit={handleTokenFormSubmit}
      />
    </div>
  );
}

export default App;
