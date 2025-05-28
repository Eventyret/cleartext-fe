"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // timestamp when the limit resets
}

export default function RateLimitBanner() {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(
    null
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check local storage for rate limit info
    const storedInfo = localStorage.getItem("rateLimitInfo");
    if (storedInfo) {
      const parsedInfo = JSON.parse(storedInfo);
      // Only show if the reset time hasn't passed yet
      if (parsedInfo.reset > Date.now() / 1000) {
        setRateLimitInfo(parsedInfo);
      } else {
        localStorage.removeItem("rateLimitInfo");
      }
    }
  }, []);

  // Update rate limit info when received from API responses
  useEffect(() => {
    const handleRateLimitUpdate = (event: CustomEvent<RateLimitInfo>) => {
      const info = event.detail;
      setRateLimitInfo(info);
      localStorage.setItem("rateLimitInfo", JSON.stringify(info));
    };

    window.addEventListener(
      "ratelimit-updated",
      handleRateLimitUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "ratelimit-updated",
        handleRateLimitUpdate as EventListener
      );
    };
  }, []);

  if (
    !rateLimitInfo ||
    dismissed ||
    rateLimitInfo.remaining > rateLimitInfo.limit * 0.2
  ) {
    return null;
  }

  const resetDate = new Date(rateLimitInfo.reset * 1000);
  const formattedResetTime = resetDate.toLocaleTimeString();

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <div className="flex-1">
        <AlertTitle>API Rate Limit Warning</AlertTitle>
        <AlertDescription>
          You have {rateLimitInfo.remaining} of {rateLimitInfo.limit} requests
          remaining. Limits will reset at {formattedResetTime}.
        </AlertDescription>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-full hover:bg-amber-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
}
