import { Header } from "@/components/header";

export default function Loading() {
  return (
    <>
      <Header />

      <div className="flex min-h-[calc(100vh-73px)] w-full flex-col md:flex-row">
        <aside className="w-full border-b border-sidebar-border bg-sidebar p-4 md:h-[calc(100vh-73px)] md:w-80 md:border-b-0 md:border-r">
          <div className="h-6 w-44 rounded-md bg-muted animate-pulse" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-4 rounded bg-muted animate-pulse" />
            ))}
          </div>
        </aside>

        <main className="flex-1 p-10">
          <div className="mb-6 h-9 w-56 rounded-md bg-muted animate-pulse" />
          <ul className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <li key={index} className="rounded bg-gray-50 p-3">
                <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  );
}
