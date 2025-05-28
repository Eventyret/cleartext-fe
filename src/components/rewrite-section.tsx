"use client";

import type React from "react";
import { useState } from "react";
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
import { PenTool, Loader2 } from "lucide-react";
import { rewriteText } from "../actions/rewrite";
import { FormSection } from "./FormSection";
import { ResultDisplay } from "./ResultDisplay";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoadingSkeleton } from "./LoadingSkeleton";

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
        setResult(response.data || "");
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
    <FormSection
      title="Text Rewriting"
      description="Rewrite sentences in different styles. Perfect for adjusting tone and formality."
      icon={PenTool}
      iconColor="text-green-600"
    >
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
              <SelectItem value="formal">Formal - Professional tone</SelectItem>
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

      {error && <ErrorDisplay error={error} onRetry={retryRequest} />}
      {isLoading && !error && (
        <LoadingSkeleton label="Rewritten text" lines={1} />
      )}
      {result && !isLoading && (
        <ResultDisplay result={result} label="Rewritten text" />
      )}
    </FormSection>
  );
}
