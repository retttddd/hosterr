import * as React from "react";
import { PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  children,
  className,
  defaultCollapsed = false,
}: React.PropsWithChildren<{ className?: string; defaultCollapsed?: boolean }>) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  const toggleSidebar = React.useCallback(() => {
    setCollapsed((previous) => !previous);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      <div
        data-slot="sidebar-provider"
        data-collapsed={collapsed ? "true" : "false"}
        className={cn("flex min-h-[calc(100vh-73px)] w-full flex-col md:flex-row", className)}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

export const Sidebar = React.forwardRef<HTMLElement, React.ComponentProps<"aside">>(
  ({ className, ...props }, ref) => {
    const { collapsed } = useSidebar();

    return (
    <aside
      ref={ref}
      data-slot="sidebar"
      data-collapsed={collapsed ? "true" : "false"}
      className={cn(
        "w-full shrink-0 border-b border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:h-[calc(100vh-73px)] md:border-b-0 md:border-r",
        collapsed ? "md:w-16" : "md:w-80",
        className
      )}
      {...props}
    />
    );
  }
);
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-header"
    className={cn("border-b border-sidebar-border p-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-content"
    className={cn("max-h-[70vh] overflow-y-auto md:max-h-none md:h-[calc(100%-65px)]", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"section">
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    data-slot="sidebar-group"
    className={cn("border-b border-sidebar-border p-4 last:border-b-0", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h2">
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    data-slot="sidebar-group-label"
    className={cn(
      "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
      className
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";
