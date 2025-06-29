import { useAuth } from "@/hooks/useAuth";

import { Ticket, Calendar, CircleCheckBig, TrendingUp } from "lucide-react";
import { Widget } from "@/components/dashboard/Widget";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { getAgentDashboard } from "@/services/dashboard.service";

const Dashboard = () => {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getAgentDashboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const stats = [
    {
      icon: <Ticket className="h-6 w-6 text-blue-600" />,
      subText: "Total Tickets",
      title: "Tickets",
      count: data?.stats?.totalTickets || 0,
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      subText: "Number of In-Progress Tickets",
      title: "In-Progress",
      count: data?.stats?.departmentCount || 0,
    },
    {
      icon: <CircleCheckBig className="h-6 w-6 text-green-600" />,
      subText: "Number of resolved tickets",
      title: "Resolved",
      count: data?.stats?.resolved || 0,
    },
  ];
  return (
    <main className="p-4 space-y-6 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Widget
            key={index}
            icon={stat.icon}
            subText={stat.subText}
            title={stat.title}
            count={stat.count}
          />
        ))}
      </div>

      <div className="grid gap-4 ">
        <RecentActivity
          recents={data?.recents || []}
          subtitle="Latest update from your works"
        />
      </div>
    </main>
  );
};

export default Dashboard;
