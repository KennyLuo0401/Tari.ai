export interface DCARecord {
    id: string;
    date: string;
    type: 'current' | 'past' | 'upcoming';
    asset: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    status: 'active' | 'completed' | 'scheduled';
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
    api: string;
    content: {
      html: string;
      markdown: string;
      text: string;
    };
    elements: Array<{
      category: string;
      content: {
        html: string;
        markdown: string;
        text: string;
      };
      coordinates: Array<{
        x: number;
        y: number;
      }>;
      id: number;
      page: number;
    }>;
    merged_elements: any[];
    model: string;
    ocr: boolean;
    usage: {
      pages: number;
    };
  }