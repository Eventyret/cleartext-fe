import RateLimitBanner from "@/components/rate-limit-banner";
import RewriteSection from "@/components/rewrite-section";
import SummarizeSection from "@/components/summarize-section";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Cleartext</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A simple developer tool for text-based tasks. Summarize content,
            rewrite text in different styles, and detect languages with ease.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Press{" "}
            <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs">
              /
            </kbd>{" "}
            for keyboard shortcuts
          </p>
        </div>

        <RateLimitBanner />

        {/* Main Content */}
        <div className="space-y-8">
          <SummarizeSection />

          <Separator className="my-8" />

          <RewriteSection />

          <Separator className="my-8" />

          {/* <LanguageDetectSection /> */}
        </div>

        <div className="text-center mt-16 text-slate-500 text-sm">
          <p>Built with Next.js, Tailwind CSS, and ShadCN UI</p>
        </div>
      </div>

      {/* <KeyboardShortcuts /> */}
    </div>
  );
}
