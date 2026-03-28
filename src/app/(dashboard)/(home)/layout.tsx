import React from "react";

import { requireAuth } from "@/lib/auth-utils";
import AppHeader from "@/components/dashboard/app-header";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  );
};

export default Layout;
