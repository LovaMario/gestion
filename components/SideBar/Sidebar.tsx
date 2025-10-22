"use client";

import { useState, useEffect } from "react";
import { Tabs, Group, Text, UnstyledButton, Menu, Title } from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconSwitchHorizontal,
  IconPackageExport,
  IconDatabaseImport,
  IconUserCircle,
} from "@tabler/icons-react";
import BonDeSortiePage from "../bon/BonDeSortie";
import ManifoldPage from "../manifold/manifold";

const user = {
  name: "Gestion de stocks HAZOVATO",
  image: "logo.png",
};

const tabsData = [
  {
    label: "Bon de sortie",
    value: "BonDeSortie",
    component: <BonDeSortiePage />,
    Icon: IconPackageExport,
  },
  {
    label: "Manifold",
    value: "manifold",
    component: <ManifoldPage />,
    Icon: IconDatabaseImport,
  },
];

export default function HeaderGestion() {
  const [activeTab, setActiveTab] = useState<string>("BonDeSortie");
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [userName, setUserName] = useState(user.name);

  useEffect(() => {
    const updateUserName = () => {
      const name = localStorage.getItem("userName");
      setUserName(name && name.trim() !== "" ? name : user.name);
    };
    updateUserName();
    window.addEventListener("storage", updateUserName);
    window.addEventListener("focus", updateUserName);
    return () => {
      window.removeEventListener("storage", updateUserName);
      window.removeEventListener("focus", updateUserName);
    };
  }, []);

  return (
    <div>
      {/* HEADER */}
      <Group grow m={-20}>
        <Group m={30} display={"flex-start"}>
          <img src="logo.png" width={100} />
          <Title order={2} ml={20}>
            GESTION DE STOCKS
          </Title>
        </Group>
        <Group m={25} justify="flex-end">
          {/* Menu utilisateur */}
          <Menu
            width={400}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onOpen={() => setUserMenuOpened(true)}
            onClose={() => setUserMenuOpened(false)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton>
                <Group gap="sm">
                  <IconUserCircle size={25} color="#c94b06" />
                  <Title order={6} size="sm" c="#c94b06">
                    {userName}
                  </Title>
                  <IconChevronDown size={14} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconSwitchHorizontal size={16} />}
                onClick={() => (window.location.href = "/login")}
              >
                Changer de compte
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLogout size={16} />}
                onClick={() => (window.location.href = "/login")}
              >
                Se déconnecter
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
      {/* TABS HEADER */}
      <Tabs
        ml={10}
        visibleFrom="sm"
        value={activeTab}
        onChange={(value: string | null) =>
          value !== null && setActiveTab(value)
        }
        variant="outline"
      >
        <Tabs.List>
          {tabsData.map((tab) => (
            <Tabs.Tab key={tab.value} value={tab.value}>
              <Group gap={5}>
                <tab.Icon size={20} />
                <Text>{tab.label}</Text>
              </Group>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* Contenu */}
      <div style={{ justifyContent: "space-evenly" }}>
        {tabsData.find((t) => t.value === activeTab)?.component ?? null}
      </div>
    </div>
  );
}
