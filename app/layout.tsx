// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppTopBar } from "@/components/layout/app-top-bar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppProviders } from '@/context/app-providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SGD Colca",
  description: "Sistema de Gestión Documental Colca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
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
            <SidebarInset className="border-0"> {/* 👈 AGREGUÉ border-0 */}
              <AppTopBar />
              <div className="flex flex-1 flex-col">
                  {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </AppProviders>
      </body>
    </html>
  );
}