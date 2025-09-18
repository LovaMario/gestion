"use client";

import React, { useEffect, useState } from "react";
import { BonDeSortie } from "./BonDeSortie";
import { Card, ScrollArea, Select, Text, Title } from "@mantine/core";

type Props = {
  BonDeSortie: BonDeSortie[];
  setBonDeSortie: React.Dispatch<React.SetStateAction<BonDeSortie[]>>;
  selectedBonDeSortie: BonDeSortie | null;
  setSelectedBonDeSortie: React.Dispatch<
    React.SetStateAction<BonDeSortie | null>
  >;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveAndReturn: (updatedBonDeSortie: BonDeSortie) => void;
};
export default function BonDeSortieDetails({
  BonDeSortie,
  setBonDeSortie,
  selectedBonDeSortie,
  setSelectedBonDeSortie,
  isEditing,
  setIsEditing,
  onSaveAndReturn,
}: Props) {
  //Magasin
  const [magasinOptions, setMagasinOption] = useState(["Central", "Vato"]);
  const [magasinValue, setMagasinValue] = useState<string | null>(null);
  const [magasinInput, setMagasinInput] = useState("");

  const handleMagasinKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && magasinInput.trim() !== "") {
      if (!magasinOptions.includes(magasinInput)) {
        setMagasinOption((prev) => [...prev, magasinInput]);
        setMagasinValue(magasinInput);
      }
    }
  };

  //Depot
  const [depotOptions, setDepotOptions] = useState(["Central", "Vato"]);
  const [depotValue, setDepotValue] = useState<string | null>(null);
  const [depotInput, setDepotInput] = useState("");
  const handleDepotKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && depotInput.trim() !== ""){
        if (!depotOptions.includes(depotInput)){
            setDepotOptions((prev) => [...prev, depotInput]);
            setDepotValue(depotInput);
        }
    }
  }

  // Département
  const [departementOptions, setdepartementOptions] = useState([
    "Fer",
    "Central",
    "Immobilier",
  ]);
  const [departementValue, setdepartementValue] = useState<string | null>(null);
  const [departementInput, setdepartementInput] = useState("");

  const handledepartementKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && departementInput.trim() !== "") {
      if (!departementOptions.includes(departementInput)) {
        setdepartementOptions((prev) => [...prev, departementInput]);
        setdepartementValue(departementInput);
      }
    }
  };

  //   Atelier
  const [atelierOptions, setatelierOptions] = useState([
    "Automatique",
    "Jour forcé",
  ]);
  const [atelierValue, setatelierValue] = useState<string | null>(null);
  const [atelierInput, setatelierInput] = useState("");

  const handleatelierKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && atelierInput.trim() !== "") {
      if (!atelierOptions.includes(atelierInput)) {
        setatelierOptions((prev) => [...prev, atelierInput]);
        setatelierValue(atelierInput);
      }
    }
  };

  //   Secteur
  const [secteurOptions, setsecteurOptions] = useState([
    "Automatique",
    "Jour forcé",
  ]);
  const [secteurValue, setsecteurValue] = useState<string | null>(null);
  const [secteurInput, setsecteurInput] = useState("");

  const handlesecteurKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && secteurInput.trim() !== "") {
      if (!secteurOptions.includes(secteurInput)) {
        setsecteurOptions((prev) => [...prev, secteurInput]);
        setsecteurValue(secteurInput);
      }
    }
  };

  const [piece, setPiece] = useState<number | undefined>(undefined);
  const [manuelle, setManuelle] = useState<number | undefined>(undefined);
  const [magasin, setMagasin] = useState("");
  const [datesortie, setDateSortie] = useState("");
  const [departement, setDepartement] = useState("");
  const [atelier, setatelier] = useState("");
  const [depot, setDepot] = useState("");
  const [secteur, setSecteur] = useState("");
  const [motif, setMotif] = useState("");
  const [codeArticle, setCodeArticle] = useState<number | undefined>(undefined);
  const [libelleArticle, setLibelleArticle] = useState("");
  const [quantite, setQuantite] = useState<number | undefined>(undefined);
  const [imputation, setImputation] = useState("");
  const [imputationCode, setImputationCode] = useState("");
  const [commande, setCommande] = useState("");
  const [submited, setSubmited] = useState(false);

  useEffect(() => {
    if (selectedBonDeSortie) {
      setPiece(selectedBonDeSortie.piece);
      setManuelle(selectedBonDeSortie.manuelle);
      setMagasin(selectedBonDeSortie.depot);
      setDateSortie(selectedBonDeSortie.date_sortie);
      setDepartement(selectedBonDeSortie.departement);
      setatelier(selectedBonDeSortie.atelier);
      setDepot(selectedBonDeSortie.depot);
      setSecteur(selectedBonDeSortie.secteur);
      setMotif(selectedBonDeSortie.motif);
      setCodeArticle(selectedBonDeSortie.codeArticle);
      setLibelleArticle(selectedBonDeSortie.libelleArticle);
      setQuantite(selectedBonDeSortie.quantite);
      setImputation(selectedBonDeSortie.imputation);
      setImputationCode(selectedBonDeSortie.imputationCode);
      setCommande(selectedBonDeSortie.commande);
    } else {
      setPiece(undefined);
      setManuelle(undefined);
      setMagasin("");
      setDateSortie("");
      setDepartement("");
      setatelier("");
      setDepot("");
      setSecteur("");
      setMotif("");
      setCodeArticle(undefined);
      setLibelleArticle("");
      setQuantite(undefined);
      setImputation("");
      setImputationCode("");
      setCommande("");
    }
  }, [selectedBonDeSortie]);

  const handleSave = () => {
    if (selectedBonDeSortie) {
      const updatedBonDeSortie: BonDeSortie = {
        ...selectedBonDeSortie,
        piece: piece || 0,
        manuelle: manuelle || 0,
        depot: magasin,
        date_sortie: datesortie,
        departement: departement,
        atelier: atelier,
        secteur: secteur,
        motif: motif,
        codeArticle: codeArticle || 0,
        libelleArticle,
        quantite: quantite || 0,
        imputation: imputation,
        imputationCode: imputationCode,
        commande: commande,
      };
      setBonDeSortie((prev) =>
        prev.map((b) =>
          b.id === updatedBonDeSortie.id ? updatedBonDeSortie : b
        )
      );
      setSelectedBonDeSortie(updatedBonDeSortie);
      setIsEditing(false);
    }
    // Si aucun bon de sortie n'est sélectionné, on pourrait envisager de créer un nouveau bon de sortie ici.
    setIsEditing(false);
  };

  if (!isEditing && !selectedBonDeSortie) {
    return (
      <Card shadow="sm" radius={"md"} p={"md"} m={10}>
        <Text>
          Sélectionnez un bon de sortie pour voir les détails ou cliquez sur
          "Nouveau Bon de sortie" pour en créer un.
        </Text>
      </Card>
    );
  }

  return (
    <ScrollArea h={500} type="scroll">
      <Card shadow="sm" radius={"md"} p={"md"} m={10}>
        <Title order={3} mb="md">
          {selectedBonDeSortie
            ? "Détails du Bon de Sortie"
            : "Nouveau Bon de Sortie"}
        </Title>

        {submited && (
          <div style={{ color: "green", marginBottom: "1rem" }}>
            La demande de bon de sortie a été enregistrée
          </div>
        )}

        <Title order={4} m="md">
          Entête
        </Title>
        <Select 
        required 
        label="Depot"
        size='sm'
        searchable
        data={depotOptions}
        value={depotValue}
        onChange={setDepotValue}
        onSearchChange={setDepotInput}
        onKeyDown={handleDepotKeyDown}
        placeholder="Sélectionner ou ajouter un dépôt"
        />
      </Card>
    </ScrollArea>
  );
}
