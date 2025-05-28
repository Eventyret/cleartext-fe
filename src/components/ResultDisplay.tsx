"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ResultDisplayProps {
  result: string;
  label: string;
}

export function ResultDisplay({ result, label }: ResultDisplayProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success("Copied!", {
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Could not copy to clipboard",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
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
  );
}
