import React from 'react';
import { ProcessingStatus } from '../types';

interface ProcessingIndicatorProps {
  status: ProcessingStatus;
}

export function ProcessingIndicator({ status }: ProcessingIndicatorProps) {
  if (!status.isProcessing) return null;

  return (
    <div className="mb-8 bg-blue-50 rounded-lg border border-blue-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-blue-900 font-medium font-display tracking-tight">
              {status.status || 'Processing medical records...'}
            </p>
            {status.progress !== undefined && (
              <div className="w-full bg-blue-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${status.progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {status.error && (
        <div className="bg-red-50 border-t border-red-100 p-3">
          <p className="text-red-600 text-sm font-body">{status.error}</p>
        </div>
      )}
    </div>
  );
}