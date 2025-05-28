"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Esc key even when in input fields
      if (e.key === "Escape") {
        e.preventDefault();
        // Clear the currently focused form
        const activeElement = document.activeElement;

        // If we're in an input, blur it first
        if (
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement ||
          activeElement instanceof HTMLSelectElement
        ) {
          activeElement.blur();
        }

        // Find the closest form section and clear it
        if (activeElement) {
          const formElement = activeElement.closest("form");
          if (formElement) {
            // Find and click the clear button in this form
            const clearButton = formElement.querySelector(
              'button[type="button"]'
            ) as HTMLButtonElement;
            if (
              clearButton &&
              (clearButton.textContent?.includes("Clear") ||
                clearButton.textContent?.includes("Reset"))
            ) {
              clearButton.click();
              return;
            }
          }
        }

        // Fallback: try to clear all forms by finding clear buttons
        const clearButtons = document.querySelectorAll('button[type="button"]');
        for (const button of clearButtons) {
          if (
            button.textContent?.includes("Clear") ||
            button.textContent?.includes("Reset")
          ) {
            (button as HTMLButtonElement).click();
            break;
          }
        }
        return;
      }

      // Only handle other keyboard shortcuts when not in an input, textarea, or select
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return;
      }

      // Ctrl/Cmd + / to show help
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        toast.info("Keyboard Shortcuts", {
          description: (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                  Ctrl/Cmd + /
                </kbd>
                <span className="text-gray-700">Show this help</span>
              </div>
              <div className="flex justify-between items-center">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                  1
                </kbd>
                <span className="text-gray-700">Go to Summarize</span>
              </div>
              <div className="flex justify-between items-center">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                  2
                </kbd>
                <span className="text-gray-700">Go to Rewrite</span>
              </div>
              <div className="flex justify-between items-center">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                  3
                </kbd>
                <span className="text-gray-700">Go to Language Detect</span>
              </div>
              <div className="flex justify-between items-center">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                  Esc
                </kbd>
                <span className="text-gray-700">Clear current form</span>
              </div>
            </div>
          ),
          duration: 5000,
        });
      }

      // Number keys to navigate to sections
      if (e.key === "1") {
        e.preventDefault();
        document
          .getElementById("summarize-text")
          ?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("summarize-text")?.focus();
      } else if (e.key === "2") {
        e.preventDefault();
        document
          .getElementById("rewrite-text")
          ?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("rewrite-text")?.focus();
      } else if (e.key === "3") {
        e.preventDefault();
        document
          .getElementById("detect-text")
          ?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("detect-text")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null; // This component doesn't render anything
}
