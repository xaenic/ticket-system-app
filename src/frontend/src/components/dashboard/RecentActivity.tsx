import type { ITicket } from "@/interfaces/ITicket";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Calendar, Clock } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/utils/colors";
import { BASE_API_URL } from "@/utils/api";
const RecentActivity = ({
  subtitle,
  recents,
}: {
  subtitle: string;
  recents: ITicket[];
}) => {
  const getInitials = (name: string) => {
    const words = name.split(" ");
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  if (!recents || recents.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-blue-600">
            {subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Calendar className="h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-blue-600">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recents.map((ticket, index) => (
            <div key={ticket.id} className="group">
              <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                    <AvatarImage
                      src={
                        BASE_API_URL?.replace("/api", "/storage/") +
                        ticket.client?.avatar
                      }
                      alt={ticket.client?.name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                      {getInitials(ticket.client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {ticket.client.name}
                      </h4>
                    </div>
                    <p
                      className="text-sm text-gray-600 truncate mt-1"
                      title={ticket.title}
                    >
                      {ticket.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-medium uppercase",
                          getStatusColor(ticket.status)
                        )}
                      >
                        {ticket.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        #{ticket.id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right ml-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <time dateTime={ticket.updated_at}>
                      {formatDistanceToNow(parseISO(ticket.updated_at || ""), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>
                </div>
              </div>
              {index < recents.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
