"use client";

import { useState, useEffect } from "react";
import {
  AppShell,
  ScrollArea,
  Box,
  Title,
  Image,
  Group,
  Text,
} from "@mantine/core";
import {
  IconLogout,
  IconSwitchHorizontal,
  IconDatabaseExport,
  IconDatabaseImport,
  IconUserCircle,
  IconPackageExport,
} from "@tabler/icons-react";
import BonDeSortiePage from "../bon/BonDeSortie";
import ManifoldPage from "../manifold/manifold";

// Importe ici tes composants de gestion
const ACTIVE_COLOR = "#c94b06";

// MenuItem simple
function MenuItem({ value, label, active, onClick, Icon }: any) {
  {
    return (
      <div
        onClick={() => onClick(value)}
        style={{
          cursor: "pointer",
          padding: "8px",
          borderRadius: "4px",
          backgroundColor: active === value ? ACTIVE_COLOR : "transparent",
          color: active === value ? "white" : "black",
          marginBottom: "4px",
        }}
      >
        <Icon style={{ marginRight: "8px" }} />
        {label}
      </div>
    );
  }
}

export default function NavbarGestion() {
  const [active, setActive] = useState("");
  const [userName, setUserName] = useState("Gestion de stocks HAZOVATO");
  useEffect(() => {
    const updateUserName = () => {
      const name = localStorage.getItem("userName");
      setUserName(
        name && name.trim() !== "" ? name : "Gestion de stocks HAZOVATO"
      );
    };
    updateUserName();
    window.addEventListener("storage", updateUserName);
    window.addEventListener("focus", updateUserName);
    return () => {
      window.removeEventListener("storage", updateUserName);
      window.removeEventListener("focus", updateUserName);
    };
  }, []);
  const gestionData = [
    {
      value: "BonDeSortie",
      label: "Bon de sortie",
      Icon: IconPackageExport,
      component: <BonDeSortiePage />,
    },
    {
      value: "manifold",
      label: "Manifold",
      Icon: IconDatabaseImport,
      component: <ManifoldPage />,
    },
  ];
  return (
    <div style={{ display: "flex", width: "100vw" }}>
      {/* Navbar */}
      <AppShell.Navbar
        w={{ base: 300 }}
        style={{ borderRight: "1px solid #ddd" }}
      >
        <Group justify="center">
          <Title order={6} mt="sm">
            GESTION DE STOCKS
          </Title>
        </Group>

        <ScrollArea
          style={{
            height: "calc(100vh - 160px)",
            marginTop: 20,
            marginLeft: 15,
            marginRight: 15,
          }}
        >
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
        <Group justify="center" mb={10}>
          <Image src="logo.png" alt="Favicon" height={100} fit="contain" />
        </Group>
        <Group justify="center" ml={-30} grow>
          <IconUserCircle style={{ marginRight: -70  }} />
          <Title order={6}>{userName}</Title>
        </Group>

        <Group
          justify="column"
          gap="xs"
          style={{ marginTop: "auto", marginBottom: 20, margin: 20 }}
        >
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
      <div
        style={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
          marginLeft: "300px",
          position: "relative",
        }}
      >
        {gestionData.find((d) => d.value === active)?.component ?? (
          <AppShell mt={250} ml={600} pos="fixed">
            <img src="logo.png" />
          </AppShell>
        )}
      </div>
    </div>
  );
}
