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

/* UI */
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs.jsx";

import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import { Progress } from "../../components/ui/progress.jsx";

/* Charts */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

import ChartContainer from "../../components/charts/ChartContainer.jsx";
import ResponsiveChart from "../../components/charts/ResponsiveChart.jsx";
import ChartCard from "../../components/charts/ChartCard.jsx";

/* Colors */
const CHART_COLORS = ["#009894", "#142730", "#0B161B", "#D2EDED", "#087A75"];

export default function AdminDashboard() {
  const { data: overview, isLoading } = useOverview();
  const { data: visitStats } = useVisitStats("week");
  const { data: speciesStats } = useSpeciesStats();
  const { data: vetStats } = useVetStats();

  if (isLoading) return <LoadingSpinner />;

  const stats = overview?.data;
  const visits = visitStats?.data || [];
  const species = speciesStats?.data || [];
  const vets = vetStats?.data || [];

  const maxCases = Math.max(...vets.map((v) => v.totalCases), 1);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* HEADER */}
      <PageHeader
        title="Admin Analytics"
        description={
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Clinic performance metrics & insights
          </span>
        }
      />

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pets"
          value={stats?.totalPets || 0}
          icon={PawPrint}
        />
        <StatCard title="Owners" value={stats?.totalOwners || 0} icon={Users} />
        <StatCard
          title="Active Vets"
          value={stats?.totalVets || 0}
          icon={Stethoscope}
        />
        <StatCard
          title="Today's Visits"
          value={stats?.totalVisitsToday || 0}
          icon={ClipboardList}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CHARTS */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="visits">
            <TabsList className="bg-slate-100 p-1 rounded-xl mb-4">
              <TabsTrigger value="visits">Visits</TabsTrigger>
              <TabsTrigger value="species">Species</TabsTrigger>
            </TabsList>

            {/* VISITS */}
            <TabsContent value="visits">
              <ChartCard
                title="Check-in Volume"
                description="Weekly patient intake"
                icon={TrendingUp}
              >
                <ChartContainer height={400}>
                  <ResponsiveChart>
                    <BarChart data={visits}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />

                      <XAxis
                        dataKey="_id"
                        tickFormatter={(d) =>
                          new Date(d).toLocaleDateString("en-US", {
                            weekday: "short",
                          })
                        }
                      />

                      <YAxis />
                      <Tooltip />

                      <Bar
                        dataKey="count"
                        fill="#009894"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveChart>
                </ChartContainer>
              </ChartCard>
            </TabsContent>

            {/* SPECIES */}
            <TabsContent value="species">
              <ChartCard
                title="Species Distribution"
                description="Pet population breakdown"
                icon={PieIcon}
              >
                <ChartContainer height={320}>
                  <ResponsiveChart>
                    <PieChart>
                      <Pie
                        data={species}
                        dataKey="count"
                        nameKey="_id"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={6}
                      >
                        {species.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveChart>
                </ChartContainer>

                {/* LEGEND */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {species.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                      <span className="text-xs font-bold capitalize">
                        {item._id} ({item.count})
                      </span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT PANEL - VETS */}
        <div>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
            <div className="bg-[#0B161B] text-white p-5 flex items-center gap-3">
              <UserCheck className="text-[#009894]" />
              <div>
                <h3 className="font-bold">Top Vets</h3>
                <p className="text-xs text-slate-400">Monthly performance</p>
              </div>
            </div>

            <ScrollArea className="h-[420px] p-5 space-y-6">
              {vets.map((vet) => (
                <div key={vet._id} className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">{vet.name}</p>
                      <p className="text-xs text-slate-400">{vet.email}</p>
                    </div>

                    <div className="font-bold text-lg">{vet.totalCases}</div>
                  </div>

                  <Progress
                    value={(vet.totalCases / maxCases) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </ScrollArea>

            <div className="p-4 border-t">
              <button className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
