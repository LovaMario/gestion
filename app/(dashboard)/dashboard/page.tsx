"use client";

import NavbarSimpleColored from "@/components/SideBar/Sidebar";
import { AppShell, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

function DashboardPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <AppShell>
      {/*Header */}
      <AppShell.Header></AppShell.Header>

      {/*NavBar */}
      <AppShell.Navbar></AppShell.Navbar>
      <NavbarSimpleColored />
      {/*Contenu*/}
      <AppShell.Main>
        {/*Main Section*/}
      </AppShell.Main>
    </AppShell>
  );
}
export default DashboardPage
