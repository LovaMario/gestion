"use client";

import Footer from "@/components/Footer/footer";
import { MantineProvider, AppShell } from "@mantine/core";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <AppShell
        footer={{ height: 50 }}
        styles={{
          main: {
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          },
        }}
      >
        <AppShell.Main style={{ flex: 1 }}>{children}</AppShell.Main>

        <AppShell.Footer>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}
