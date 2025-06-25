import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Widget = ({subText, count, title, icon}: {subText:string, count:number, title:string, icon: React.ReactNode}) => {
  return (
    <Card className="border-none shadow-none ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          {subText}
        </p>
      </CardContent>
    </Card>
  );
};
