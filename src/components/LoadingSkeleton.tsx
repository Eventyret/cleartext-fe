import { Label } from "@/components/ui/label";

interface LoadingSkeletonProps {
  label: string;
  lines?: number;
  type?: "default" | "language";
}

export function LoadingSkeleton({
  label,
  lines = 3,
  type = "default",
}: LoadingSkeletonProps) {
  if (type === "language") {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg animate-pulse">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-3 bg-slate-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
      </div>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg animate-pulse">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-slate-200 rounded ${
              i === lines - 1 ? "w-5/6" : i % 2 === 0 ? "w-3/4" : "w-full"
            } ${i < lines - 1 ? "mb-2" : ""}`}
          ></div>
        ))}
      </div>
    </div>
  );
}
