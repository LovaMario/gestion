"use client";

import { useState } from "react";
import { AppShell, ScrollArea, Box, Title, Image, Group } from "@mantine/core";
import {
  IconArrowBigUpLinesFilled,
  IconDatabaseImport,
  IconKey,
  IconReceipt2,
  IconSettings,
  Icon2fa,
  IconFingerprint,
  IconLogout,
  IconSwitchHorizontal,
} from "@tabler/icons-react";

// Importe ici tes composants de gestion
import BonDeSortiePage from "../bon/BonDeSortie";
const ACTIVE_COLOR = "#F1841F";

// MenuItem simple
function MenuItem({
  value,
  label,
  active,
  onClick,
  Icon,
}: {
  value: string;
  label: string;
  active: string;
  onClick: (v: string) => void;
  Icon: any;
}) {
  return (
    <div
      onClick={() => onClick(value)}
      style={{
        cursor: "pointer",
        padding: "8px",
        borderRadius: "4px",
        backgroundColor: active === value ? ACTIVE_COLOR : "transparent",
        color: active === value ? "white" : "black",
        display: "flex",
        alignItems: "center",
        marginBottom: "4px",
      }}
    >
      <Icon style={{ marginRight: "8px" }} />
      {label}
    </div>
  );
}

// Tableau des sections gestion
const gestionData = [
  {
    value: "BonDeSortie",
    label: "BonDeSortie",
    Icon: IconDatabaseImport,
    component: <BonDeSortiePage />,
  },
  {
    value: "machines",
    label: "Machines / Organes",
    Icon: IconArrowBigUpLinesFilled,
    component: <div>Machines Page</div>,
  },
  {
    value: "outillages",
    label: "Outillages",
    Icon: IconKey,
    component: <div>Outillages Page</div>,
  },
  {
    value: "magasin",
    label: "Magasin",
    Icon: IconReceipt2,
    component: <div>Magasin Page</div>,
  },
  {
    value: "stocks",
    label: "Stocks",
    Icon: IconSettings,
    component: <div>Stocks Page</div>,
  },
  {
    value: "ordinateurs",
    label: "Ordinateurs & Réseau",
    Icon: Icon2fa,
    component: <div>Ordinateurs Page</div>,
  },
  {
    value: "personnel",
    label: "Personnel",
    Icon: IconFingerprint,
    component: <div>Personnel Page</div>,
  },
];

export default function NavbarGestion() {
  const [active, setActive] = useState("equipements");

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Navbar */}
      <AppShell.Navbar
        w={{ base: 300 }}
        style={{ borderRight: "1px solid #ddd" }}
      >
        

        <ScrollArea style={{ height: "calc(100vh - 160px)" }}>
          {gestionData.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              label={item.label}
              active={active}
              onClick={setActive}
              Icon={item.Icon}
            />
          ))}
        </ScrollArea>
        <Box style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Image src="/logo.png" alt="Logo" height={100} fit="contain" />
          <Title order={6} mt="sm">
            Gestion
          </Title>
        </Box>

        <Group justify="column" gap="xs" style={{ marginTop: "auto" }}>
          <div
            onClick={() => (window.location.href = "/login")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <IconSwitchHorizontal style={{ marginRight: "8px" }} />
            Change account
          </div>

          <div
            onClick={() => (window.location.href = "/login")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <IconLogout style={{ marginRight: "8px" }} />
            Logout
          </div>
        </Group>
      </AppShell.Navbar>

      {/* Contenu */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {gestionData.find((d) => d.value === active)?.component ?? (
          <div>Sélectionnez un élément du menu</div>
        )}
      </div>
    </div>
  );
}
