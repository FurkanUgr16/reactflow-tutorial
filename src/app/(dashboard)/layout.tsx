import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/app-sidebar";
import { requireAuth } from "@/lib/auth-utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  await requireAuth();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
