"use client";
import React, { useState } from "react";
import BonDeSortieDetails from "./BonDeSortieDetails";
import BonDeSortieListe from "./BonDeSortieListe";
import { Button, Group } from "@mantine/core";

export type BonDeSortie = {
  id: number;
  piece: number;
  manuelle: number;
  quantite: number;
  dateSortie: string;
  magasin: string;
  depot: string;
  departement: string;
  secteur: string;
  atelier: string;
  codeArticle: string;
  libelleArticle: string;
  imputation: string;
  imputationCode: string;
  commande: string;
  unite: string;
  check1: boolean;
  check2: boolean;
  check3: boolean;
  locked1: boolean;
  locked2: boolean;
  locked3: boolean;

  // ✅ Ajout pour les noms confirmateurs
  checkerNames?: { [key: number]: string };
};

export default function BonDeSortiePage() {
  const handleNewBon = () => {
    setSelectedBonDeSortie(null);
    setIsEditing(true);
  };

  const [bonsDeSortie, setBonDeSortie] = useState<BonDeSortie[]>([]);
  const [selectedBonDeSortie, setSelectedBonDeSortie] =
    useState<BonDeSortie | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveAndReturn = (updatedBon: BonDeSortie) => {
    // Mise à jour ou ajout si nouveau
    setBonDeSortie((prev) => {
      const exists = prev.find((b) => b.id === updatedBon.id);
      if (exists) {
        return prev.map((b) => (b.id === updatedBon.id ? updatedBon : b));
      } else {
        return [...prev, updatedBon];
      }
    });
    setSelectedBonDeSortie(updatedBon);
    setIsEditing(false);
  };

  return (
    <div>
      <Group>
        <Button justify="flex-start" onClick={handleNewBon} color="#c94b06">
          Nouveau bon
        </Button>
      </Group>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 3 }}>
          <BonDeSortieDetails
            BonsDeSortie={bonsDeSortie}
            setBonsDeSortie={setBonDeSortie}
            selectedBonDeSortie={selectedBonDeSortie}
            setSelectedBonDeSortie={setSelectedBonDeSortie}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSaveAndReturn={handleSaveAndReturn}
          />
        </div>
        <div style={{ flex: 2 }}>
          <BonDeSortieListe
            bonsDeSortie={bonsDeSortie}
            setBonsDeSortie={setBonDeSortie}
            setSelectedBonDeSortie={setSelectedBonDeSortie}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
    </div>
  );
}
