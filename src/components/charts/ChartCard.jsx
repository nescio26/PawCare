import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

export default function ChartCard({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <Card className="border-none ring-1 ring-slate-200/60 shadow-sm overflow-hidden bg-white">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs font-medium">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
