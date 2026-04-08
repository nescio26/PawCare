import { cn } from "../../utils/cn.js";

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        {Icon && (
          <div className={cn("p-2 rounded-md", color || "bg-primary/10")}>
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
      <p className="text-2xl font-semibold">{value ?? "—"}</p>
    </div>
  );
}
