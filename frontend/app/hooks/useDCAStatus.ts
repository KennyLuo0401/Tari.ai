import { useState, useEffect } from "react";
import { DCARecord } from "../types";

interface DCAStatus {
  isRunning: boolean;
  history: Array<{
    time: string;
    status: string;
    txHash?: string;
    error?: string;
  }>;
}

export function useDCAStatus(pollInterval: number = 5000) {
  const [dcaStatus, setDcaStatus] = useState<DCAStatus>({
    isRunning: false,
    history: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://tari-pyuzwmauh-mxber2022s-projects.vercel.app/dca/status"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDcaStatus(data);
      } catch (e: any) {
        setError(e.message || "Could not fetch DCA status");
        console.error("Error fetching DCA status:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, pollInterval);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [pollInterval]);

  const formatDCARecords = (status: DCAStatus): DCARecord[] => {
    return status.history.map((entry, index) => ({
      id: entry.txHash || `${index}-${entry.time}`,
      date: new Date(entry.time).toLocaleDateString(),
      type: index === 0 ? "current" : "past",
      asset: "SUSHI",
      amount: 0.01,
      frequency: "daily",
      status: entry.status.toLowerCase() as
        | "active"
        | "completed"
        | "scheduled",
      details: {
        "Transaction Hash": entry.txHash || "N/A",
        Status: entry.status,
        Time: new Date(entry.time).toLocaleTimeString(),
        ...(entry.error && { Error: entry.error }),
      },
    }));
  };

  return {
    dcaStatus,
    isLoading,
    error,
    records: formatDCARecords(dcaStatus),
  };
}
