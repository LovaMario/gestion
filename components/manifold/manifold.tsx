"use client";
import { AppShell, Button, Group } from "@mantine/core";
import React, { useState, useEffect } from "react";
import ManifoldDetails from "./manifoldDetails";
import ManifoldListe from "./manifoldListe";

export type Manifold = {
  id: number;
  Demandeur: string;
  recepteur: string;
  code1: string;
  code2: string;
  code3?: string;
  dateCommande: string;
  articles: Article[];
  motif: string;
  check1: boolean;
  check2: boolean;
  check3: boolean;
  locked1: boolean;
  locked2: boolean;
  locked3: boolean;
  checker1_nom: string | null;
  checker2_nom: string | null;
  checker3_nom: string | null;
};

export type Article = {
  id: number; // ID temporaire pour la gestion React (key, suppression)
  finCompteur: number;
  quantite: number;
  NomArticle: string;
  DPU: string;
  unite: string;
  imputation: string;
  code3?: string; // code machine par article
};

export default function ManifoldPage() {
  const handleNewManifold = () => {
    setSelectedManifold(null);
    setIsEditing(true);
  };

  const [manifold, setManifold] = useState<Manifold[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedManifold, setSelectedManifold] = useState<Manifold | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  // Charger les manifolds existants au montage
  useEffect(() => {
    const fetchManifolds = async () => {
      try {
        const res = await fetch("/api/manifold");
        if (!res.ok) {
          // Essaie de lire le JSON d'erreur, sinon le texte brut
          let errBody;
          try {
            errBody = await res.json();
          } catch (_) {
            try {
              errBody = await res.text();
            } catch (_) {
              errBody = null;
            }
          }
          console.error(
            "/api/manifold failed",
            res.status,
            res.statusText,
            errBody
          );
          throw new Error(
            `Erreur fetch /api/manifold: ${res.status} ${res.statusText} - ${
              typeof errBody === "string"
                ? errBody
                : errBody?.message || JSON.stringify(errBody) || ""
            }`
          );
        }
        const data: Manifold[] = await res.json();
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
        })) as Manifold[];
        setManifold(transformed);
      } catch (err) {
        console.error("Erreur chargement BSM :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchManifolds();
  }, []);

  const handleSaveAndReturn = async (
    updatedManifold: Manifold,
    shouldExitEditing: boolean = true
  ) => {
    try {
      const res = await fetch("/api/manifold");
      if (!res.ok) throw new Error("Erreur lors du fetch");
      const data: Manifold[] = await res.json();
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
      })) as Manifold[];
      setManifold(transformed);
    } catch (err) {
      console.error("Erreur rechargement BSM :", err);
    }

    setSelectedManifold(updatedManifold);
    if (shouldExitEditing) {
      setIsEditing(false);
    }
  };

  return (
    <AppShell style={{ padding: "2rem" }}>
      <div>
        <Group>
          <Button
            justify="flex-start"
            onClick={handleNewManifold}
            color="#c94b06"
          >
            Nouveau Manifold
          </Button>
        </Group>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div style={{ flex: 3 }}>
            <ManifoldDetails
              Manifold={manifold}
              setManifold={setManifold}
              selectedManifold={selectedManifold}
              setSelectedManifold={setSelectedManifold}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSaveAndReturn={handleSaveAndReturn}
            />
          </div>
          <div style={{ flex: 2 }}>
            <ManifoldListe
              Manifold={manifold}
              setManifold={setManifold}
              setSelectedManifold={setSelectedManifold}
              setIsEditing={setIsEditing}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
