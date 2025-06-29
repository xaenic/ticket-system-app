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

import type { ITicket } from "@/interfaces/ITicket";
import { getPriorityColor, getStatusColor } from "@/utils/colors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_API_URL } from "@/utils/api";
import { getInitials } from "@/utils/helpers";

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

      <div className="grid gap-6 ">
        <Card className="shadow-sm border border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-none border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Tag className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Recent Tickets
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Your latest ticket activity
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {data?.recents?.length || 0} tickets
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 border-none hover:bg-slate-50/50">
                    <TableHead className="text-slate-700 font-semibold text-xs uppercase tracking-wider py-3 px-6">
                      Ticket Details
                    </TableHead>
                    <TableHead className="text-slate-700 font-semibold text-xs uppercase tracking-wider py-3 px-4">
                      Priority
                    </TableHead>
                    <TableHead className="text-slate-700 font-semibold text-xs uppercase tracking-wider py-3 px-4">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-700 font-semibold text-xs uppercase tracking-wider py-3 px-6">
                      Assigned To
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.recents && data.recents.length > 0 ? (
                    data.recents.map((ticket: ITicket) => (
                      <TableRow
                        key={ticket.id}
                        className="border-slate-100 hover:bg-slate-50/30 transition-colors duration-200 cursor-pointer group"
                      >
                        <TableCell className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                TKT-{ticket.id}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900 transition-colors">
                              {ticket.title.length > 30
                                ? `${ticket.title.slice(0, 30)}...`
                                : ticket.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={`font-medium text-xs ${getPriorityColor(
                              ticket.priority || ""
                            )}`}
                          >
                            {ticket?.priority?.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={`font-medium text-xs ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket?.status?.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {ticket?.assigneduser?.name ? (
                              <>
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      BASE_API_URL?.replace(
                                        "/api",
                                        "/storage/"
                                      ) + ticket.assigneduser?.avatar
                                    }
                                    alt={ticket.assigneduser.name}
                                  />
                                  <AvatarFallback className="bg-blue-500 text-white">
                                    {getInitials(ticket?.assigneduser?.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-slate-700 font-medium">
                                  {ticket.assigneduser.name}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-slate-400 italic">
                                Unassigned
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <Ticket className="w-8 h-8 text-slate-300" />
                          <p className="text-slate-500 text-sm">
                            No recent tickets found
                          </p>
                          <p className="text-slate-400 text-xs">
                            Your tickets will appear here when available
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-3 p-4">
              {data?.recents && data.recents.length > 0 ? (
                data.recents.map((ticket: ITicket) => (
                  <div
                    key={ticket.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 hover:bg-slate-50/30 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          TKT-{ticket.id}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={`font-medium text-xs ${getPriorityColor(
                              ticket.priority || ""
                            )}`}
                          >
                            {ticket?.priority?.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`font-medium text-xs ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket?.status?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-800">
                        {ticket.title.length > 60
                          ? `${ticket.title.slice(0, 60)}...`
                          : ticket.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        Assigned To
                      </span>
                      <div className="flex items-center space-x-2">
                        {ticket?.assigneduser?.name ? (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  BASE_API_URL?.replace("/api", "/storage/") +
                                  ticket?.assigneduser?.avatar
                                }
                                alt={ticket.assigneduser.name}
                              />
                              <AvatarFallback className="bg-blue-500 text-white">
                                {getInitials(ticket?.assigneduser?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-slate-700 font-medium">
                              {ticket.assigneduser.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-slate-400 italic">
                            Unassigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Ticket className="w-8 h-8 text-slate-300" />
                    <p className="text-slate-500 text-sm">
                      No recent tickets found
                    </p>
                    <p className="text-slate-400 text-xs">
                      Your tickets will appear here when available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
