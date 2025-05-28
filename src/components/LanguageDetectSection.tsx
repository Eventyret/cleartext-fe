"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Loader2 } from "lucide-react";
import { detectLanguage } from "@/actions/language-detect";
import { FormSection } from "./FormSection";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface LanguageResult {
  code: string;
  name: string;
  confidence?: number;
}

export default function LanguageDetectSection() {
  const [result, setResult] = useState<LanguageResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Controlled form state
  const [text, setText] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      // Input validation
      if (!text || text.trim().length < 2) {
        setError(
          "Please enter at least 2 characters of text to detect language"
        );
        setIsLoading(false);
        return;
      }

      // Create FormData manually
      const formData = new FormData();
      formData.append("text", text);

      const response = await detectLanguage(formData);
      if (response.success) {
        setResult(response.data || null);
      } else {
        setError(response.error || "Failed to detect language");
      }
    } catch (err) {
      setError(
        "Connection failed. Please check your internet connection and try again."
      );
      console.error("Language detection error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const fillSampleText = (language: string) => {
    let sampleText = "";

    switch (language) {
      case "en":
        sampleText = "The quick brown fox jumps over the lazy dog.";
        break;
      case "es":
        sampleText = "El rápido zorro marrón salta sobre el perro perezoso.";
        break;
      case "fr":
        sampleText =
          "Le rapide renard brun saute par-dessus le chien paresseux.";
        break;
      case "de":
        sampleText = "Der schnelle braune Fuchs springt über den faulen Hund.";
        break;
      case "no":
        sampleText = "Den raske brune reven hopper over den late hunden.";
        break;
      default:
        sampleText = "The quick brown fox jumps over the lazy dog.";
    }

    setText(sampleText);
  };

  const clearForm = () => {
    setText("");
    setResult(null);
    setError("");
  };

  const retryRequest = () => {
    setError("");
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const getLanguageFlag = (code: string) => {
    const flags: Record<string, string> = {
      en: "🇺🇸",
      es: "🇪🇸",
      fr: "🇫🇷",
      de: "🇩🇪",
      it: "🇮🇹",
      pt: "🇵🇹",
      ru: "🇷🇺",
      ja: "🇯🇵",
      ko: "🇰🇷",
      zh: "🇨🇳",
      ar: "🇸🇦",
      hi: "🇮🇳",
      nl: "🇳🇱",
      sv: "🇸🇪",
      no: "🇳🇴",
      da: "🇩🇰",
      fi: "🇫🇮",
      pl: "🇵🇱",
      tr: "🇹🇷",
      th: "🇹🇭",
      vi: "🇻🇳",
    };
    return flags[code] || "🌐";
  };

  return (
    <FormSection
      title="Language Detection"
      description="Automatically detect the language of any text input. Useful for internationalization and content analysis."
      icon={Globe}
      iconColor="text-purple-600"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="detect-text">Text to analyze</Label>
            <div className="text-xs text-slate-500">
              {text.length} characters
            </div>
          </div>
          <div className="relative">
            <Input
              id="detect-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text in any language..."
              required
              className="pr-20"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 h-full px-2 text-xs"
              onClick={() => fillSampleText("en")}
            >
              Sample
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fillSampleText("es")}
          >
            🇪🇸 Spanish
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fillSampleText("fr")}
          >
            🇫🇷 French
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fillSampleText("de")}
          >
            🇩🇪 German
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fillSampleText("no")}
          >
            🇳🇴 Norwegian
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            type="submit"
            disabled={isLoading || text.length < 2}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Detect Language
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
        <LoadingSkeleton label="Language" type="language" />
      )}

      {result && !isLoading && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-center space-x-4">
            <div
              className="text-4xl"
              role="img"
              aria-label={`${result.name} flag`}
            >
              {getLanguageFlag(result.code)}
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">
                {result.name}
              </p>
              <p className="text-sm text-slate-600">
                Language Code: {result.code.toUpperCase()}
              </p>
              {result.confidence && (
                <p className="text-xs text-slate-500 mt-1">
                  Confidence: {Math.round(result.confidence * 100)}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </FormSection>
  );
}
