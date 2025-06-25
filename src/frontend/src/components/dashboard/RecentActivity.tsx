import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Calendar } from "lucide-react";
const RecentActivity = () => {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-blue-600">
          Latest updates from your ticket system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                New ticket created
              </p>
              <p className="text-sm text-muted-foreground">by John Doe</p>
            </div>
            <div className="text-xs text-muted-foreground">2 min ago</div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Ticket resolved
              </p>
              <p className="text-sm text-muted-foreground">by Jane Smith</p>
            </div>
            <div className="text-xs text-muted-foreground">15 min ago</div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                User registered
              </p>
              <p className="text-sm text-muted-foreground">by Mike Johnson</p>
            </div>
            <div className="text-xs text-muted-foreground">1 hour ago</div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Ticket assigned
              </p>
              <p className="text-sm text-muted-foreground">by Sarah Wilson</p>
            </div>
            <div className="text-xs text-muted-foreground">2 hours ago</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
