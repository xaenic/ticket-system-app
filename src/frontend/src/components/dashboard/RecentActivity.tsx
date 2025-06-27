import type { ITicket } from "@/interfaces/ITicket";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Calendar } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { statusColorCodes } from "./admin/ColumnsTicket";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
const RecentActivity = ({
  subtitle,
  recents,
}: {
  subtitle: string;
  recents: ITicket[];
}) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-blue-600">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {recents.map((ticket) => (
            <div>
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex ">
                  <Avatar>
                    <AvatarImage src={ticket.client.avatar} alt="@shadcn" />
                    <AvatarFallback>
                      {ticket.client.name[0]}
                      {ticket.client.name[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col ml-3">
                    <div className="flex items-center gap-1 justify-between">
                      <p className="text-sm font-medium  text-slate-600 leading-none">
                        {ticket.client.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">
                        {ticket.title}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-end items-end text-xs text-muted-foreground text-right self-end">
                  <Badge className="text-green-500 bg-transparent  uppercase self-end">
                    {ticket.status}
                  </Badge>

                  {formatDistanceToNow(parseISO(ticket.updated_at || ""), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
