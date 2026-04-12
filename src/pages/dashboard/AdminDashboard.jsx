import {
  useOverview,
  useVisitStats,
  useSpeciesStats,
  useVetStats,
} from "../../hooks/useAnalytics.js";
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
  Calendar,
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

// 1. Production Palette from your color image
const CHART_COLORS = ["#009894", "#142730", "#0B161B", "#D2EDED", "#087A75"];

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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <PageHeader
        title="Admin Analytics"
        description={
          <span className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" />
            Clinic performance metrics and patient trends
          </span>
        }
      />

      {/* 2. Stat Cards Section - Refined with softer shadows and themed borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pets"
          value={stats?.totalPets || 0}
          icon={PawPrint}
          className="border-none bg-white shadow-sm ring-1 ring-slate-200/60 hover:ring-primary/40 transition-all"
        />
        <StatCard
          title="Total Owners"
          value={stats?.totalOwners || 0}
          icon={Users}
          className="border-none bg-white shadow-sm ring-1 ring-slate-200/60 hover:ring-primary/40 transition-all"
        />
        <StatCard
          title="Active Vets"
          value={stats?.totalVets || 0}
          icon={Stethoscope}
          className="border-none bg-white shadow-sm ring-1 ring-slate-200/60 hover:ring-primary/40 transition-all"
        />
        <StatCard
          title="Today's Visits"
          value={stats?.totalVisitsToday || 0}
          icon={ClipboardList}
          className="border-none bg-primary text-white shadow-md shadow-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Main Analytics Charts (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="visits" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger
                  value="visits"
                  className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Visit Trends
                </TabsTrigger>
                <TabsTrigger
                  value="species"
                  className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Species Data
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="visits"
              className="mt-0 focus-visible:outline-none"
            >
              <Card className="border-none ring-1 ring-slate-200/60 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        Check-in Volume
                      </CardTitle>
                      <CardDescription className="text-xs font-medium">
                        Daily patient intake for current week
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[400px] pt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visits}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#E2E8F0"
                      />
                      <XAxis
                        dataKey="_id"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "#64748b",
                          fontWeight: 500,
                        }}
                        tickFormatter={(str) =>
                          new Date(str).toLocaleDateString("en-US", {
                            weekday: "short",
                          })
                        }
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <Tooltip
                        cursor={{ fill: "#F1F5F9" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          padding: "12px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#009894"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="species"
              className="mt-0 focus-visible:outline-none"
            >
              <Card className="border-none ring-1 ring-slate-200/60 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <PieIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900">
                        Species Diversity
                      </CardTitle>
                      <CardDescription className="text-xs font-medium">
                        Population breakdown by pet type
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[400px] flex flex-col items-center justify-center">
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={species}
                          dataKey="count"
                          nameKey="_id"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={8}
                        >
                          {species.map((_, i) => (
                            <Cell
                              key={i}
                              fill={CHART_COLORS[i % CHART_COLORS.length]}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-6 mt-4">
                    {species.slice(0, 6).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                        <span className="text-xs font-bold text-slate-600 capitalize">
                          {item._id}{" "}
                          <span className="text-slate-400 font-normal">
                            ({item.count})
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 4. Vet Performance Section (1/3 width) */}
        <div className="space-y-6">
          <Card className="border-none ring-1 ring-slate-200/60 shadow-sm flex flex-col bg-white overflow-hidden min-h-[550px]">
            <CardHeader className="bg-[#0B161B] text-white pb-6 pt-7">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-[#009894]" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold tracking-tight">
                    Top Performing Vets
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-0.5">
                    Total cases handled this month
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-6 space-y-8">
                  {vets.length === 0 ? (
                    <div className="py-20 text-center text-slate-400">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-10" />
                      <p className="text-sm italic">No vet activity logged</p>
                    </div>
                  ) : (
                    vets.map((vet) => (
                      <div key={vet._id} className="group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {/* Larger, cleaner Avatar */}
                            <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-700 group-hover:bg-[#009894] group-hover:text-white transition-all duration-300 border border-slate-200 shadow-sm">
                              {vet.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-[#0B161B] group-hover:text-[#009894] transition-colors truncate max-w-[140px]">
                                {vet.name}
                              </h4>
                              <p className="text-[11px] font-medium text-slate-400 truncate max-w-[140px]">
                                {vet.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-[#0B161B]">
                              {vet.totalCases}
                            </span>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              Cases
                            </p>
                          </div>
                        </div>

                        {/* Progress Section - Better Spacing */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Activity size={10} className="text-[#009894]" />
                              Efficiency
                            </span>
                            <span className="text-[#009894]">
                              {Math.round((vet.totalCases / maxCases) * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={(vet.totalCases / maxCases) * 100}
                            className="h-2 bg-slate-100 rounded-full overflow-hidden"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Refined Footer Action */}
            <div className="p-5 bg-slate-50/50 border-t border-slate-100 mt-auto">
              <button className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-[#0B161B] hover:bg-[#0B161B] hover:text-white hover:border-[#0B161B] transition-all duration-200 uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm">
                <Calendar className="w-3.5 h-3.5" />
                Download Monthly Report
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
