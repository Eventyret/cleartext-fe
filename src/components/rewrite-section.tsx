"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, PenTool, Loader2, RefreshCw } from "lucide-react";
import { rewriteText } from "@/actions/rewrite";
import { toast } from "sonner";

export default function RewriteSection() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Controlled form state
  const [text, setText] = useState<string>("");
  const [style, setStyle] = useState<string>("simple");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setResult("");
    setIsLoading(true);

    try {
      // Input validation
      if (!text || text.trim().length < 3) {
        setError("Please enter at least 3 characters of text to rewrite");
        setIsLoading(false);
        return;
      }

      // Create FormData manually
      const formData = new FormData();
      formData.append("text", text);
      formData.append("style", style);

      const response = await rewriteText(formData);
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || "Failed to rewrite text");
      }
    } catch (err) {
      setError(
        "Connection failed. Please check your internet connection and try again."
      );
      console.error("Rewrite error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copied!", {
        description: "Rewritten text copied to clipboard",
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Could not copy to clipboard",
      });
    }
  };

  const fillSampleText = () => {
    setText("The meeting is scheduled for tomorrow at 3 PM.");
  };

  const clearForm = () => {
    setText("");
    setStyle("simple");
    setResult("");
    setError("");
  };

  const retryRequest = () => {
    setError("");
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5 text-green-600" />
          Text Rewriting
        </CardTitle>
        <CardDescription>
          Rewrite sentences in different styles. Perfect for adjusting tone and
          formality.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="rewrite-text">Text to rewrite</Label>
              <div className="text-xs text-slate-500">
                {text.length} characters
              </div>
            </div>
            <div className="relative">
              <Input
                id="rewrite-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter a sentence you'd like to rewrite..."
                required
                className="pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-2 text-xs"
                onClick={fillSampleText}
              >
                Sample
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rewrite-style">Writing style</Label>
            <Select value={style} onValueChange={setStyle} required>
              <SelectTrigger id="rewrite-style">
                <SelectValue placeholder="Choose writing style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">
                  Simple - Easy to understand
                </SelectItem>
                <SelectItem value="formal">
                  Formal - Professional tone
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isLoading || text.length < 3}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rewriting...
                </>
              ) : (
                <>
                  <PenTool className="mr-2 h-4 w-4" />
                  Rewrite
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={clearForm}
            >
              Clear
            </Button>
          </div>
        </form>

        {error && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium mb-1">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
                {error.includes("Connection failed") && (
                  <p className="text-red-500 text-xs mt-1">
                    Your text has been preserved. Check your connection and try
                    again.
                  </p>
                )}
              </div>
              {error.includes("Connection failed") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryRequest}
                  className="ml-3 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        )}

        {isLoading && !error && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Summary</Label>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        )}

        {result && !isLoading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Rewritten text</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="h-8"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-slate-700 leading-relaxed">{result}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
