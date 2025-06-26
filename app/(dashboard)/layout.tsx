import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppTopBar } from "@/components/layout/app-top-bar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider
      suppressHydrationWarning
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="border-0">
        <AppTopBar />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}