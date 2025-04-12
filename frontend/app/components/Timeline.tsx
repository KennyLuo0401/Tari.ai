import React from "react";
import {
  Clock,
  Calendar,
  ArrowUpCircle,
  Repeat,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { DCARecord } from "../types";

interface TimelineProps {
  records: DCARecord[];
  isLoading?: boolean;
  error?: string | null;
}

export function Timeline({ records, isLoading, error }: TimelineProps) {
  const getIcon = (type: DCARecord["type"]) => {
    switch (type) {
      case "current":
        return <ArrowUpCircle className="h-5 w-5 text-white" />;
      case "past":
        return <Clock className="h-5 w-5 text-white" />;
      case "upcoming":
        return <Calendar className="h-5 w-5 text-white" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "active":
        return "border-l-4 border-green-400 bg-zinc-800/50 hover:bg-zinc-700/50";
      case "completed":
        return "border-l-4 border-blue-400 bg-zinc-800/50 hover:bg-zinc-700/50";
      case "scheduled":
        return "border-l-4 border-yellow-400 bg-zinc-800/50 hover:bg-zinc-700/50";
      default:
        return "border-l-4 border-zinc-600 bg-zinc-800/50 hover:bg-zinc-700/50";
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-zinc-900 rounded-xl shadow-xl overflow-hidden border border-zinc-800">
      <div className="flex-none p-6 border-b border-zinc-800 bg-zinc-900/80">
        <h2 className="font-display text-xl tracking-tight text-white flex items-center">
          <Repeat className="h-5 w-5 mr-2" />
          DCA Timeline
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
            <span className="ml-3 text-white/70">Loading DCA records...</span>
          </div>
        )}

        {error && (
          <div className="p-6 text-red-400 text-center bg-red-950/20">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && records.length === 0 && (
          <div className="p-6 text-center text-zinc-400">
            <p>
              No DCA records found. Start a DCA strategy to see the history
              here.
            </p>
          </div>
        )}

        <div className="divide-y divide-zinc-800">
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group p-4 transition-all duration-300 hover:cursor-pointer ${getStatusStyles(
                record.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -inset-0.5 bg-white/10 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                    <div className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-700">
                      {getIcon(record.type)}
                    </div>
                  </div>
                  <div>
                    <p className="font-display text-base tracking-tight text-white group-hover:text-gray-300 transition-colors">
                      {record.asset} - ${record.amount}
                    </p>
                    <p className="text-xs tracking-wider text-zinc-400 uppercase">
                      {record.frequency} | {record.date}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
              </div>

              {record.details && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 ml-11 grid grid-cols-2 gap-2"
                >
                  {Object.entries(record.details).map(([key, value]) => (
                    <div key={key} className="text-sm font-body">
                      <span className="text-zinc-400">{key}:</span>{" "}
                      <span className="font-medium text-white">
                        {value.toString()}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
