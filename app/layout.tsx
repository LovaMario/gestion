
import "@mantine/core/styles.css";
import { ColorSchemeScript } from "@mantine/core";
import { ReactNode } from "react";
import { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Gestion de stock",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr"  data-mantine-color-scheme="light">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
