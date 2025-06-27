import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { AlertTriangle } from "lucide-react";
import { Separator } from "../ui/separator";
import type { IStat } from "@/interfaces/IStat";

export const TicketStatus = ({ stats }: { stats: IStat }) => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5" />
          Ticket Status
        </CardTitle>
        <CardDescription className="text-blue-600">
          Current ticket distribution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
       
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Resolved
              </span>
            </div>
            <span className="text-sm font-semibold">{stats?.closedTicketsCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Pending</span>
            </div>
            <span className="text-sm font-semibold">{stats?.pendingTicketsCount}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Urgent</span>
            </div>
            <span className="text-sm font-semibold">{stats?.urgentTicketsCount}</span>
          </div>
        </div>

        <Separator className="my-4 mt-8 border border-slate-100" />

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-gray-800">
            Total Tickets
          </span>
          <span className="text-lg font-bold text-blue-600">{stats?.totalTicketsCount}</span>
        </div>
      </CardContent>
    </Card>
  );
};
