import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  icon: Icon,
  iconColor,
  children,
}: FormSectionProps) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}
