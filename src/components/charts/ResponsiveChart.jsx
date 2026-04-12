import { ResponsiveContainer } from "recharts";

export default function ResponsiveChart({ children }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  );
}
