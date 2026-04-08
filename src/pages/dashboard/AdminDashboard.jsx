import {
  useOverview,
  useVisitStats,
  useSpeciesStats,
  useVetStats,
} from "../../hooks/useAnalytisc.js";
import StatCard from "../../components/shared/StatCard.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import {
  PawPrint,
  Users,
  Stethoscope,
  ClipboardList,
  Activity,
  PieChart as PieIcon,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card.jsx";
import { Progress } from "../../components/ui/progress.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs.jsx";
import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminDashboard() {
  const { data: overview, isLoading: overviewLoading } = useOverview();
  const { data: visitStats } = useVisitStats("week");
  const { data: speciesStats } = useSpeciesStats();
  const { data: vetStats } = useVetStats();

  if (overviewLoading) return <LoadingSpinner />;

  const stats = overview?.data;
  const visits = visitStats?.data || [];
  const species = speciesStats?.data || [];
  const vets = vetStats?.data || [];
  const maxCases = Math.max(...vets.map((v) => v.totalCases), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <PageHeader
        title="Admin Analytics"
        description="Comprehensive clinic performance metrics and patient trends"
      />

      {/* 1. Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pets"
          value={stats?.totalPets || 0}
          icon={PawPrint}
          className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-all"
        />
        <StatCard
          title="Total Owners"
          value={stats?.totalOwners || 0}
          icon={Users}
          className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all"
        />
        <StatCard
          title="Active Vets"
          value={stats?.totalVets || 0}
          icon={Stethoscope}
          className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all"
        />
        <StatCard
          title="Today's Visits"
          value={stats?.totalVisitsToday || 0}
          icon={ClipboardList}
          className="border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Main Analytics Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="visits" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="visits" className="px-4">
                  Visit Trends
                </TabsTrigger>
                <TabsTrigger value="species" className="px-4">
                  Species Data
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="visits" className="mt-0">
              <Card className="border-border/40 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/5 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        Check-in Volume
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Patient visits over the last 7 days
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[350px] pt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visits}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--muted))"
                        opacity={0.4}
                      />
                      <XAxis
                        dataKey="_id"
                        tick={{
                          fontSize: 11,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(str) => {
                          const date = new Date(str);
                          return date.toLocaleDateString("en-US", {
                            weekday: "short",
                          });
                        }}
                      />
                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid hsl(var(--border))",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--primary))"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="species" className="mt-0">
              <Card className="border-border/40 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/5 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <PieIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        Species Diversity
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Distribution of patient types in the clinic
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[350px] pt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={species}
                        dataKey="count"
                        nameKey="_id"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      >
                        {species.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                            className="hover:opacity-80 transition-opacity outline-none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid hsl(var(--border))",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2">
                    {species.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-[11px] font-medium capitalize text-muted-foreground">
                          {item._id} ({item.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 3. Vet Performance Section (1/3 width) */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm h-full flex flex-col">
            <CardHeader className="bg-muted/5 border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Top Veterinarians</CardTitle>
                  <CardDescription className="text-xs">
                    Performance based on completed cases
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-6 space-y-6">
                  {vets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                      <Users className="w-10 h-10 mb-2" />
                      <p className="text-xs">No performance data yet</p>
                    </div>
                  ) : (
                    vets.map((vet) => (
                      <div key={vet._id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                              {vet.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold leading-none">
                                {vet.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground mt-1">
                                {vet.email}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-foreground">
                              {vet.totalCases}
                            </span>
                            <p className="text-[9px] uppercase tracking-tighter text-muted-foreground font-bold">
                              Cases
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                            <span>Efficiency</span>
                            <span>
                              {Math.round((vet.totalCases / maxCases) * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={(vet.totalCases / maxCases) * 100}
                            className="h-1.5 bg-primary/10"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4 bg-muted/5 border-t text-center">
              <button className="text-[11px] font-bold text-primary hover:underline uppercase tracking-widest">
                View Detailed Report
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
