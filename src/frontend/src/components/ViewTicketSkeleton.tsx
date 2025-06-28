import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ViewTicketSkeleton = () => {
  return (
    <main className="p-8 space-y-4 w-full bg-gradient-to-tr from-blue-50 to-purple-50">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2"></div>
        <div className="flex">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-10 w-10 ml-2" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-96 rounded-full" />
      </div>

      <Card className="border-none shadow-none p-4">
        <div className="gap-2 flex items-center justify-between">
          <div className="font-semibold text-lg flex items-center gap-2">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="gap-2 flex items-center">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-18" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="min-h-[100px] bg-slate-100 p-3 rounded-md space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-3 w-80" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-3 w-40" />
          </div>

          <Separator className="border border-slate-100" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <div className="flex flex-col gap-2 flex-1 items-end">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2 max-w-md">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              </div>

              <div className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-32 w-full rounded-md" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="#bottom"></div>
    </main>
  );
};

export default ViewTicketSkeleton;
