import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <>
      <Header />

      <div className="flex flex-col gap-8 p-10 m-20">
        <div className="h-9 w-64 rounded-md bg-muted animate-pulse" />

        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-5 rounded bg-muted animate-pulse" />
                <div className="h-5 rounded bg-muted animate-pulse" />
                <div className="h-5 rounded bg-muted animate-pulse" />
                <div className="h-5 rounded bg-muted animate-pulse" />
              </div>

              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <div className="h-5 rounded bg-muted animate-pulse" />
                  <div className="h-5 rounded bg-muted animate-pulse" />
                  <div className="h-5 rounded bg-muted animate-pulse" />
                  <div className="h-5 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
