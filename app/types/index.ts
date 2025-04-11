export interface HealthRecord {
  id: string;
  date: string;
  type: 'diagnosis' | 'medication' | 'allergy' | 'lab';
  description: string;
  severity?: 'low' | 'medium' | 'high';
  details?: {
    [key: string]: string | number | boolean;
  };
}

export interface ProcessingStatus {
  isProcessing: boolean;
  progress?: number;
  status?: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UpstageResponse {
  apiVersion: string;
  confidence: number;
  metadata: {
    pages: Array<{
      height: number;
      page: number;
      width: number;
    }>;
  };
  mimeType: string;
  modelVersion: string;
  numBilledPages: number;
  pages: Array<{
    confidence: number;
    height: number;
    id: number;
    text: string;
    width: number;
    words: Array<{
      boundingBox: {
        vertices: Array<{
          x: number;
          y: number;
        }>;
      };
      confidence: number;
      id: number;
      text: string;
    }>;
  }>;
  stored: boolean;
  text: string;
}