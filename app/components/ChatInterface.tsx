import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';

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
  isProcessing = false 
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
      setInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
            <h2 className="font-display text-lg font-medium tracking-tight text-white">Tactical AI</h2>
            <p className="text-xs tracking-wider text-zinc-400 uppercase">Fast, brainy portfolio optimization</p>
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
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-4 ${
                  message.role === 'user'
                    ? 'bg-white text-black shadow-monochrome'
                    : 'bg-zinc-800 text-white border border-zinc-700'
                }`}
              >
                <p className="text-sm leading-relaxed font-body whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs tracking-wide mt-2 block opacity-75">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-900/80">
        <div className="flex space-x-2">
          <motion.label 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-none"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png,.doc,.docx"
              className="hidden"
            />
            <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-white cursor-pointer transition-all border border-zinc-700">
              <Upload className="h-5 w-5" />
            </div>
          </motion.label>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tactical rebalancing strategies..."
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
      </form>
    </div>
  );
}