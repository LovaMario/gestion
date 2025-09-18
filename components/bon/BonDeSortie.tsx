"use client";

import {
  AppShell,
  Button,
  Group,
  Tabs,
  Title,
} from "@mantine/core";
import { useState } from "react";
import BonDeSortieListe from "./BonDeSortieListe";
import BonDeSortieDetails from "./BonDeSortieDetails";

export type BonDeSortie = {
  id: number;
  piece: number;
  manuelle: number;
  quantite: number;
  date_sortie: string;
  depot: string;
  motif: string;
  departement: string;
  secteur: string;
  atelier: string;
  codeArticle: number;
  libelleArticle: string;
  imputation: string;
  imputationCode: string;
  commande: string;
  identification: number;
};

export default function BonDeSortiePage() {
  const [BonDeSortie, setBonDeSortie] = useState<BonDeSortie[]>([]);
  const [selectedBonDeSortie, setSelectedBonDeSortie] =
    useState<BonDeSortie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isActiveTab, setIsActiveTab] = useState<string | null>("liste");

  const handleNewBonDeSortie = () => {
    setSelectedBonDeSortie(null);
    setIsEditing(true);
    setIsActiveTab("details");
  };
  const handleSelectBonDeSortieForEdit = (bonDeSortie: BonDeSortie) => {
    setSelectedBonDeSortie(bonDeSortie);
    setIsEditing(true);
    setIsActiveTab("details"); // basculer vers l'onglet "Détails"
  };
  const handleSaveAndReturn = (updateBonDeSortie: BonDeSortie) => {
    setBonDeSortie((prev) =>
      prev.map((b) => (b.id === updateBonDeSortie.id ? updateBonDeSortie : b))
    );
    setIsEditing(false);
    setSelectedBonDeSortie(updateBonDeSortie);
    setIsActiveTab("liste"); // basculer vers l'onglet "Liste"
  };

  return (
    <AppShell style={{ padding: "2rem" }}>
      <Title order={2} mb="2rem">
        Bon de sortie Magasin (BSM)
      </Title>
      <Group mb="md">
        <Button onClick={handleNewBonDeSortie} color="#c94b06">
          Nouveau Bon de sortie
        </Button>
      </Group>

      <Tabs
        value={isActiveTab}
        onChange={setIsActiveTab}
        variant="outline"
        radius="md"
      >
        <Tabs.List>
          <Tabs.Tab value="liste">Liste</Tabs.Tab>
          <Tabs.Tab value="details" disabled={!isEditing}>
            Détails
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="liste" pt="md">
          <BonDeSortieListe
            BonDeSortie={BonDeSortie}
            setBonDeSortie={setBonDeSortie}
            setSelectedBonDeSortie={handleSelectBonDeSortieForEdit}
            setIsEditing={setIsEditing}
          />
        </Tabs.Panel>
        <Tabs.Panel value="details" pt="md">
          <BonDeSortieDetails
            BonDeSortie={BonDeSortie}
            setBonDeSortie={setBonDeSortie}
            selectedBonDeSortie={selectedBonDeSortie}
            setSelectedBonDeSortie={setSelectedBonDeSortie}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSaveAndReturn={handleSaveAndReturn}
          />
        </Tabs.Panel>
      </Tabs>
    </AppShell>
  );
}
