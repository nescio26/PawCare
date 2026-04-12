export default function ChartContainer({ height = 320, children }) {
  return (
    <div style={{ width: "100%", height }} className="relative">
      {children}
    </div>
  );
}
