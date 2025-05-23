import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  Upload,
  FileText,
  Image,
  Languages,
  Bitcoin,
  Clock,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "../types";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
  isProcessing?: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  onFileUpload,
  isProcessing = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const documentFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleQuickAction = (e: React.MouseEvent, message: string) => {
    e.preventDefault(); // Prevent form submission
    if (!isProcessing) {
      onSendMessage(message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      if (e.target.value) {
        e.target.value = "";
      }
    }
  };

  const handleTranslate = (message: string) => {
    onSendMessage(`Translate the following text to Russian: "${message}"`);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-zinc-900 rounded-xl shadow-xl overflow-hidden border border-zinc-800">
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

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 relative group ${
                  message.role === "user"
                    ? "bg-white text-black shadow-monochrome"
                    : "bg-zinc-800 text-white border border-zinc-700"
                }`}
              >
                <p className="text-sm leading-relaxed font-body whitespace-pre-wrap">
                  {message.content}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs tracking-wide opacity-75">
                    {formatTime(message.timestamp)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTranslate(message.content)}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                      message.role === "user"
                        ? "hover:bg-gray-100"
                        : "hover:bg-zinc-700"
                    }`}
                    title="Translate to Russian"
                  >
                    <Languages className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-zinc-800 bg-zinc-900/80"
      >
        <div className="flex flex-col space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              type="button" // Important: Specify button type
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) =>
                handleQuickAction(e, "Start a daily DCA of $10 into Bitcoin")
              }
              disabled={isProcessing}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Bitcoin className="h-4 w-4" />
              <span className="text-sm">Daily BTC ($10)</span>
            </motion.button>

            <motion.button
              type="button" // Important: Specify button type
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) =>
                handleQuickAction(e, "Start a weekly DCA of $50 into Bitcoin")
              }
              disabled={isProcessing}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Weekly BTC ($50)</span>
            </motion.button>

            <motion.button
              type="button" // Important: Specify button type
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) =>
                handleQuickAction(e, "Start a daily DCA of $25 into Bitcoin")
              }
              disabled={isProcessing}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clock className="h-4 w-4" />
              <span className="text-sm">Daily BTC ($25)</span>
            </motion.button>

            <motion.button
              type="button" // Important: Specify button type
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) =>
                handleQuickAction(e, "Start a monthly DCA of $100 into Bitcoin")
              }
              disabled={isProcessing}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Monthly BTC ($100)</span>
            </motion.button>
          </div>

          <div className="flex space-x-2">
            <div className="flex space-x-2">
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-none group relative"
                title="Upload Document (PDF, DOC)"
              >
                <input
                  type="file"
                  ref={documentFileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-white cursor-pointer transition-all border border-zinc-700">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Upload Document
                </span>
              </motion.label>

              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-none group relative"
                title="Upload Image (JPG, PNG)"
              >
                <input
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                />
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-white cursor-pointer transition-all border border-zinc-700">
                  <Image className="h-5 w-5" />
                </div>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-zinc-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Upload Image
                </span>
              </motion.label>
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about DCA strategies..."
              className="flex-1 px-4 py-2 bg-zinc-800 text-white placeholder-zinc-400 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all font-body text-sm"
              disabled={isProcessing}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isProcessing || !input.trim()}
              className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-monochrome"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
