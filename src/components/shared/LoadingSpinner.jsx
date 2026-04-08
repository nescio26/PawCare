import { cn } from "../../utils/cn.js";

export default function LoadingSpinner({ classname }) {
  return (
    <div className={cn("flex items-center justify-center py-12", classname)}>
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
