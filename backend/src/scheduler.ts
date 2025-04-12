import { runDCA, statusHistory } from './dca.ts'

let intervalId: NodeJS.Timeout | null = null;

export function startDCA(interval: number): string {
  if (intervalId) return 'Already running';
  intervalId = setInterval(runDCA, interval);
  return `Started DCA every ${interval / 1000}s`;
}

export function stopDCA(): string {
  if (!intervalId) return 'No loop running';
  clearInterval(intervalId);
  intervalId = null;
  return 'Stopped DCA loop';
}

export function isRunning(): boolean {
  return !!intervalId;
}

export function getStatus() {
  return {
    isRunning: isRunning(),
    history: statusHistory.slice(-10).reverse()
  };
}