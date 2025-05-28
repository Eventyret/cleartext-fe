"use client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const isConnectionError =
    error.includes("Connection failed") || error.includes("Failed to connect");

  return (
    <div
      className="p-4 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-red-700 text-sm font-medium mb-1">Error</p>
          <p className="text-red-600 text-sm">{error}</p>
          {isConnectionError && (
            <p className="text-red-500 text-xs mt-1">
              Your text has been preserved. Check your connection and try again.
            </p>
          )}
        </div>
        {isConnectionError && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-3 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
