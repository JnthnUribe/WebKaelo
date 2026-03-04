import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: { value: number; label?: string };
  color?: "primary" | "secondary" | "accent" | "success";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
};

export default function StatCard({ title, value, icon: Icon, change, color = "primary" }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-card card-hover">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {change && (
            <p className={`text-xs font-medium ${change.value >= 0 ? "text-success" : "text-error"}`}>
              {change.value >= 0 ? "+" : ""}{change.value}%{change.label ? ` ${change.label}` : ""}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
