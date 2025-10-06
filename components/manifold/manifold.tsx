"use client";
import { Button, Group } from "@mantine/core";
import React, { useState, useEffect } from "react";
import ManifoldDetails from "./manifoldDetails";
import ManifoldListe from "./manifoldListe";

export type Manifold = {
  id: number;
  quantite: number;
  NomArticle: string;
  Demandeur: string;
  recepteur: string;
  Imputation: string;
  code1: string;
  code2: string;
  code3: string;
  finCompteur: number;
  DPU: string;
  dateCommande: string;
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

  const handleSaveAndReturn = (updatedManifold: Manifold) => {
    // Mise à jour ou ajout si nouveau
    setManifold((prev) => {
      const exists = prev.find((b) => b.id === updatedManifold.id);
      if (exists) {
        return prev.map((b) =>
          b.id === updatedManifold.id ? updatedManifold : b
        );
      } else {
        return [...prev, updatedManifold];
      }
    });
    setSelectedManifold(updatedManifold);
    setIsEditing(false);
  };
  // Charger les manifolds existants au montage
  useEffect(() => {
    const fetchManifolds = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/manifold");
        const data = await res.json();
        setManifold(Array.isArray(data) ? data : []);
      } catch (e) {
        setManifold([]);
      } finally {
        setLoading(false);
      }
    };
    fetchManifolds();
  }, []);

  return (
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
  );
}
