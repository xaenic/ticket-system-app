import { useAuth } from "@/hooks/useAuth";

import {
  Ticket,
  Calendar,
  Tag,
  TrendingUp,
  CircleCheckBig,
} from "lucide-react";
import { Widget } from "@/components/dashboard/Widget";
import { useQuery } from "@tanstack/react-query";
import { getAgentDashboard } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  priorityColorCodes,
  statusColorCodes,
} from "@/components/dashboard/admin/ColumnsTicket";
import type { ITicket } from "@/interfaces/ITicket";

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
      count: data?.stats?.inProgress || 0,
    },
    {
      icon: <CircleCheckBig className="h-6 w-6 text-green-600" />,
      subText: "Number of resolved tickets",
      title: "Resolved",
      count: data?.stats?.resolved || 0,
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
        <Card className="shadow-none border-none">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Tag className="w-4 h-4 " />
            <CardTitle className="text-sm font-medium">
              Your Recent Tickets
            </CardTitle>
          </CardHeader>

          <CardContent className="">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-slate-700 uppercase text-xs">
                      SUBJECT
                    </TableHead>
                    <TableHead className="text-slate-700 uppercase text-xs">
                      Priority
                    </TableHead>
                    <TableHead className="text-slate-700 uppercase text-xs">
                      Status
                    </TableHead>

                    <TableHead className="text-slate-700 uppercase text-xs">
                      Assigned
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.recents?.map((ticket: ITicket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <span className="text-xs font-medium text-slate-600">
                          TKT-{ticket.id} {ticket.title.slice(0, 10)}...
                        </span>{" "}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            priorityColorCodes[
                              ticket.priority as keyof typeof priorityColorCodes
                            ]
                          }`}
                        >
                          {ticket?.priority?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statusColorCodes[
                              ticket.status as keyof typeof statusColorCodes
                            ]
                          }`}
                        >
                          {ticket?.status?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket?.assigneduser?.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
