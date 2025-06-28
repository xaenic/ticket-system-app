import { useAuth } from "@/hooks/useAuth";

import { Ticket, Calendar, Building2, User, Users2 } from "lucide-react";
import { Widget } from "@/components/dashboard/Widget";
import { TicketStatus } from "@/components/dashboard/TicketStatus";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/services/dashboard.service";

const Dashboard = () => {
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const stats = [
    {
      icon: <Ticket className="h-6 w-6 text-blue-600" />,
      subText: "Total Tickets",
      title: "Tickets",
      count: data?.stats?.totalTicketsCount || 0,
    },
    {
      icon: <Building2 className="h-6 w-6 text-orange-600" />,
      subText: "Number of Departments",
      title: "Departments",
      count: data?.stats?.departmentCount || 0,
    },
    {
      icon: <User className="h-6 w-6 text-purple-600" />,
      subText: "Active Clients",
      title: "Clients",
      count: data?.stats?.clientsCount || 0,
    },
    {
      icon: <Users2 className="h-6 w-6 text-yellow-600" />,
      subText: "Active Agents",
      title: "Agents",
      count: data?.stats?.agentsCount || 0,
    },
  ];
  return (
    <main className="min-h-screen p-4 space-y-6 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
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

      <div className="grid gap-4 md:grid-cols-2">
        <TicketStatus stats={data?.stats} />
        <RecentActivity recents={data?.recents || []} subtitle="Latest updates from client tickets"/>
      </div>
    </main>
  );
};

export default Dashboard;
