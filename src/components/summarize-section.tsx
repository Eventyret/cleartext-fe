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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, FileText, Loader2, RefreshCw } from "lucide-react";
import { summarizeText } from "@/actions/summerize";
import { toast } from "sonner";

export default function SummarizeSection() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Controlled form state
  const [text, setText] = useState<string>("");
  const [length, setLength] = useState<string>("short");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setResult("");
    setIsLoading(true);

    try {
      // Input validation
      if (!text || text.trim().length < 10) {
        setError("Please enter at least 10 characters of text to summarize");
        setIsLoading(false);
        return;
      }

      // Create FormData manually
      const formData = new FormData();
      formData.append("text", text);
      formData.append("length", length);

      const response = await summarizeText(formData);
      if (response.success) {
        setResult(response.data || "");
      } else {
        setError(response.error || "Failed to summarize text");
      }
    } catch (err) {
      setError(
        "Connection failed. Please check your internet connection and try again."
      );
      console.error("Summarize error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copied!", {
        description: "Summary copied to clipboard",
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Could not copy to clipboard",
      });
    }
  };

  const fillSampleText = () => {
    const sampleText =
      "The Internet of Things (IoT) refers to the billions of physical devices around the world that are now connected to the internet, collecting and sharing data. Thanks to cheap processors and wireless networks, it's possible to turn anything, from a pill to an airplane, into part of the IoT. This adds a level of digital intelligence to devices that would be otherwise dumb, enabling them to communicate without human involvement, and merging the digital and physical worlds.";
    setText(sampleText);
  };

  const clearForm = () => {
    setText("");
    setLength("short");
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
          <FileText className="h-5 w-5 text-blue-600" />
          Text Summarization
        </CardTitle>
        <CardDescription>
          Transform long text into concise summaries. Choose between short and
          long summary formats.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="summarize-text">Text to summarize</Label>
              <div className="text-xs text-slate-500">
                {text.length} characters
              </div>
            </div>
            <div className="relative">
              <Textarea
                id="summarize-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your long text here. This could be an article, research paper, or any content you'd like to summarize..."
                className="min-h-[120px] resize-y pr-20"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute bottom-2 right-2 text-xs h-7 px-2"
                onClick={fillSampleText}
              >
                Sample
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary-length">Summary length</Label>
            <Select value={length} onValueChange={setLength} required>
              <SelectTrigger id="summary-length">
                <SelectValue placeholder="Choose summary length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short - Quick overview</SelectItem>
                <SelectItem value="long">Long - Detailed summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isLoading || text.length < 10}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Summarize
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
              <Label>Summary</Label>
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
