import { useState } from "react";
import {
  useOverview,
  useVisitStats,
  useSpeciesStats,
  useVetStats,
  useTopDiagnoses,
} from "../../hooks/useAnalytics.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import StatCard from "../../components/shared/StatCard.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
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
} from "recharts";
import { PawPrint, Users, Stethoscope, ClipboardList } from "lucide-react";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];
const PERIODS = ["week", "month", "year"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("week");

  const { data: overview, isLoading } = useOverview();
  const { data: visitStats } = useVisitStats(period);
  const { data: speciesStats } = useSpeciesStats();
  const { data: vetStats } = useVetStats();
  const { data: diagnosesStats } = useTopDiagnoses();

  if (isLoading) return <LoadingSpinner />;

  const stats = overview?.data;
  const visits = visitStats?.data || [];
  const species = speciesStats?.data || [];
  const vets = vetStats?.data || [];
  const diagnoses = diagnosesStats?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Clinic performance and statistics"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Pets"
          value={stats?.totalPets}
          icon={PawPrint}
          color="bg-indigo-100"
        />
        <StatCard
          title="Total Owners"
          value={stats?.totalOwners}
          icon={Users}
          color="bg-green-100"
        />
        <StatCard
          title="Total Vets"
          value={stats?.totalVets}
          icon={Stethoscope}
          color="bg-amber-100"
        />
        <StatCard
          title="Visits Today"
          value={stats?.totalVisitsToday}
          icon={ClipboardList}
          color="bg-rose-100"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Visit trends</CardTitle>
          <div className="flex gap-2">
            {PERIODS.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? "default" : "outline"}
                className="h-7 text-xs capitalize"
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No visit data for this period
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={visits}>
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Patients by species
            </CardTitle>
          </CardHeader>
          <CardContent>
            {species.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={species}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ _id, percent }) =>
                      `${_id} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {species.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top diagnoses</CardTitle>
          </CardHeader>
          <CardContent>
            {diagnoses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No diagnosis data yet
              </p>
            ) : (
              <div className="space-y-3">
                {diagnoses.slice(0, 6).map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium truncate">{d._id}</span>
                        <span className="text-muted-foreground shrink-0 ml-2">
                          {d.count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(d.count / diagnoses[0].count) * 100}%`,
                            background: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cases per vet</CardTitle>
        </CardHeader>
        <CardContent>
          {vets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No vet data yet
            </p>
          ) : (
            <div className="space-y-3">
              {vets.map((vet, i) => (
                <div key={vet._id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {vet.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{vet.name}</span>
                      <span className="text-muted-foreground">
                        {vet.totalCases} cases
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${
                            (vet.totalCases /
                              Math.max(...vets.map((v) => v.totalCases))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
