import { Label } from "../ui/label";

export default function FormGroup({ label, children, error }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-destructive animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
