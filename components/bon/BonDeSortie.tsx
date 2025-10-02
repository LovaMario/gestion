// BonDeSortie.tsx (CODE CORRIGÉ - CONTENU FIXE)
"use client";
import React, { useState, useEffect } from "react";
import BonDeSortieDetails from "./BonDeSortieDetails";
import BonDeSortieListe from "./BonDeSortieListe";
import { AppShell, Button, Group } from "@mantine/core";

// 🎯 TYPE BON DE SORTIE (Inchagé)
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
  checker1_nom: string | null;
  checker2_nom: string | null;
  checker3_nom: string | null;
  checkerNames: { [key: number]: string };
};

export default function BonDeSortiePage() {
  const [bonsDeSortie, setBonsDeSortie] = useState<BonDeSortie[]>([]);
  const [selectedBonDeSortie, setSelectedBonDeSortie] =
    useState<BonDeSortie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ... (Logique de chargement et de gestion des états inchangée)
  useEffect(() => {
    const fetchBons = async () => {
      try {
        const res = await fetch("/api/bonDeSortie");
        if (!res.ok) throw new Error("Erreur lors du fetch");
        const data: BonDeSortie[] = await res.json();
        const transformed = data.map((b) => ({
          ...b,
          checker1_nom: b.checker1_nom || null,
          checker2_nom: b.checker2_nom || null,
          checker3_nom: b.checker3_nom || null,
          checkerNames: {
            1: b.checker1_nom || "",
            2: b.checker2_nom || "",
            3: b.checker3_nom || "",
          },
        })) as BonDeSortie[];
        setBonsDeSortie(transformed);
      } catch (err) {
        console.error("Erreur chargement BSM :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBons();
  }, []);

  const handleNewBon = () => {
    setSelectedBonDeSortie(null);
    setIsEditing(true);
  };

  // 🎯 DANS BonDeSortie.tsx (composant parent)

  const handleSaveAndReturn = (
    updatedBon: BonDeSortie,
    shouldExitEditing: boolean = true
  ) => {
    setBonsDeSortie((prevBons) => {
      // Déterminer si le bon existe déjà dans la liste par son ID
      const isUpdate = prevBons.some(
        (bon) => bon.id === updatedBon.id && updatedBon.id !== 0
      );

      if (isUpdate) {
        // C'est une MODIFICATION (PUT): Mettre à jour l'élément existant
        return prevBons.map((bon) =>
          bon.id === updatedBon.id ? updatedBon : bon
        );
      } else {
        // C'est une CRÉATION (POST): Ajouter le nouveau bon à la liste
        return [updatedBon, ...prevBons];
      }
    });

    setSelectedBonDeSortie(updatedBon);

    if (shouldExitEditing) {
      setIsEditing(false);
    }
  };

  return (
    // ✨ AppShell ne gère plus le positionnement "relative" ou "fixed" par défaut
    // et ne gère plus le défilement.
    <AppShell style={{ padding: "2rem" }}>
      <Group mb="md">
        <Button color="#c94b06" onClick={handleNewBon}>
          Nouveau Bon de Sortie
        </Button>
      </Group>

      {/* Le conteneur Flexbox est la seule partie qui défilera si le contenu est trop grand */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
          height: "calc(100vh - 100px)",
        }}
      >
        {/* Colonne Détails */}
        <div style={{ flex: 3, overflowY: "auto" }}>
          <BonDeSortieDetails
            BonsDeSortie={bonsDeSortie}
            setBonsDeSortie={setBonsDeSortie}
            selectedBonDeSortie={selectedBonDeSortie}
            setSelectedBonDeSortie={setSelectedBonDeSortie}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSaveAndReturn={handleSaveAndReturn}
          />
        </div>

        {/* Colonne Liste */}
        <div style={{ flex: 2, height: "100%", overflowY: "auto" }}>
          <BonDeSortieListe
            setSelectedBonDeSortie={setSelectedBonDeSortie}
            setIsEditing={setIsEditing}
            bonsDeSortie={bonsDeSortie}
            setBonsDeSortie={setBonsDeSortie}
            loading={loading}
          />
        </div>
      </div>
    </AppShell>
  );
}
