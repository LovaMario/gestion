"use client";

import React, { useEffect, useState } from "react";
import { BonDeSortie } from "./BonDeSortie";
import {
  Button,
  Card,
  Checkbox,
  Group,
  Input,
  Modal,
  NumberInput,
  PasswordInput,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IMaskInput } from "react-imask";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";

type Props = {
  BonsDeSortie: BonDeSortie[]; // ← tableau des bons
  setBonsDeSortie: (newList: BonDeSortie[]) => void;
  selectedBonDeSortie: BonDeSortie | null;
  setSelectedBonDeSortie: React.Dispatch<React.SetStateAction<BonDeSortie | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveAndReturn: (updatedBon: BonDeSortie) => void;
};

export default function BonDeSortieDetails({
  BonsDeSortie,
  setBonsDeSortie,
  selectedBonDeSortie,
  isEditing,
}: Props) {
  //Magasin
  const [magasinOptions, setMagasinOption] = useState(["Central", "Vato"]);
  const [magasinValue, setMagasinValue] = useState<string | null>(null);
  const [magasinInput, setMagasinInput] = useState("");
  const [type, toggle] = useToggle(["Se connecter", "Créer un compte"]);

  const [userName, setUserName] = useState("");
  const [loadingName, setLoadingName] = useState(false);

  const form = useForm({
    initialValues: { matricule: "", name: "", password: "" },
    validate: {
      matricule: (val) => (val.length > 0 ? null : "Matricule obligatoire"),
      password: (val) =>
        val.length < 6
          ? "Le mot de passe doit contenir au moins 6 caractères"
          : null,
      name: (val) =>
        type === "Créer un compte" && val.length < 3
          ? "Le nom est requis"
          : null,
    },
  });

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
    if (event.key === "Enter" && depotInput.trim() !== "") {
      if (!depotOptions.includes(depotInput)) {
        setDepotOptions((prev) => [...prev, depotInput]);
        setDepotValue(depotInput);
      }
    }
  };

  // Département
  const [departementOptions, setDepartementOptions] = useState([
    "Fer",
    "Central",
    "Immobilier",
  ]);
  const [departementValue, setDepartementValue] = useState<string | null>(null);
  const [departementInput, setDepartementInput] = useState("");

  const handleDeparementKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && departementInput.trim() !== "") {
      if (!departementOptions.includes(departementInput)) {
        setDepartementOptions((prev) => [...prev, departementInput]);
        setDepartementValue(departementInput);
      }
    }
  };

  //   Atelier
  const [atelierOptions, setAtelierOptions] = useState([
    "Automatique",
    "Jour forcé",
  ]);
  const [atelierValue, setAtelierValue] = useState<string | null>(null);
  const [atelierInput, setAtelierInput] = useState("");

  const handleAtelierKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && atelierInput.trim() !== "") {
      if (!atelierOptions.includes(atelierInput)) {
        setAtelierOptions((prev) => [...prev, atelierInput]);
        setAtelierValue(atelierInput);
      }
    }
  };

  //   Secteur
  const [secteurOptions, setSecteurOptions] = useState([
    "Automatique",
    "Jour forcé",
  ]);
  const [secteurValue, setSecteurValue] = useState<string | null>(null);
  const [secteurInput, setSecteurInput] = useState("");

  const handleSecteurKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && secteurInput.trim() !== "") {
      if (!secteurOptions.includes(secteurInput)) {
        setSecteurOptions((prev) => [...prev, secteurInput]);
        setSecteurValue(secteurInput);
      }
    }
  };

  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [locked1, setLocked1] = useState(false);
  const [locked2, setLocked2] = useState(false);
  const [locked3, setLocked3] = useState(false);
  const [checkerNames, setCheckerNames] = useState<{ [key: number]: string }>(
    {}
  );

  // Recherche automatique du nom en mode "Se Connecter"
  useEffect(() => {
    if (!form.values.matricule || type === "Créer un compte") {
      setUserName("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoadingName(true);
      try {
        const res = await fetch("/api/utilisateurs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matricule,
            password,
            mode: "checkbox",
            checkboxId: 1,
          }),
        });
        const data = await res.json();
        setUserName(res.ok ? data.name : "Utilisateur non trouvé");
      } catch {
        setUserName("Erreur de connexion");
      } finally {
        setLoadingName(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form.values.matricule, type]);

  // Modal
  const [opened, setOpened] = useState(false);
  const [activeCheckbox, setActiveCheckbox] = useState<number | null>(null);
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");

  // Ouverture du modal selon la case cliquée
  const handleCheckboxClick = (index: number) => {
    if (
      (index === 1 && !locked1) ||
      (index === 2 && !locked2) ||
      (index === 3 && !locked3)
    ) {
      setActiveCheckbox(index);
      setOpened(true);
    }
  };

  // Validation connexion
  const handleLogin = async () => {
    if (!matricule || !password) return;

    try {
      const res = await fetch("/api/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule,
          password,
          type: "Se Connecter",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // 🔹 On met à jour le nom et lock la checkbox
      if (activeCheckbox === 1) setCheck1(true), setLocked1(true);
      if (activeCheckbox === 2) setCheck2(true), setLocked2(true);
      if (activeCheckbox === 3) setCheck3(true), setLocked3(true);

      setCheckerNames((prev) => ({
        ...prev,
        [activeCheckbox!]: data.user.nom,
      }));

      setOpened(false);
      setActiveCheckbox(null);
      alert(`Confirmé par ${data.user.nom}`);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const [piece, setPiece] = useState<number | undefined>(undefined);
  const [manuelle, setManuelle] = useState<number | undefined>(undefined);
  const [magasin, setMagasin] = useState("");
  const [dateSortie, setDateSortie] = useState("");
  const [departement, setDepartement] = useState("");
  const [atelier, setAtelier] = useState("");
  const [depot, setDepot] = useState("");
  const [secteur, setSecteur] = useState("");
  const [codeArticle, setCodeArticle] = useState("");
  const [libelleArticle, setLibelleArticle] = useState("");
  const [quantite, setQuantite] = useState<number | undefined>(undefined);
  const [imputation, setImputation] = useState("");
  const [imputationCode, setImputationCode] = useState("");
  const [commande, setCommande] = useState("");
  const [unite, setUnite] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
  if (selectedBonDeSortie) {
    setPiece(selectedBonDeSortie.piece ?? undefined);
    setManuelle(selectedBonDeSortie.manuelle);
    setMagasinValue(selectedBonDeSortie?.magasin ?? "");
    setDateSortie(selectedBonDeSortie?.dateSortie ?? "");
    setDepartementValue(selectedBonDeSortie?.departement ?? "");
    setAtelierValue(selectedBonDeSortie?.atelier ?? "");
    setDepotValue(selectedBonDeSortie?.depot ?? "");
    setSecteurValue(selectedBonDeSortie?.secteur ?? "");
    setCodeArticle(selectedBonDeSortie.codeArticle);
    setLibelleArticle(selectedBonDeSortie.libelleArticle);
    setQuantite(selectedBonDeSortie.quantite);
    setImputation(selectedBonDeSortie.imputation);
    setImputationCode(selectedBonDeSortie.imputationCode);
    setCommande(selectedBonDeSortie.commande);
    setUnite(selectedBonDeSortie.unite);

    // ⚡ Restaurer les cases et noms
    setCheck1(selectedBonDeSortie.check1 ?? false);
    setCheck2(selectedBonDeSortie.check2 ?? false);
    setCheck3(selectedBonDeSortie.check3 ?? false);
    setLocked1(selectedBonDeSortie.locked1 ?? false);
    setLocked2(selectedBonDeSortie.locked2 ?? false);
    setLocked3(selectedBonDeSortie.locked3 ?? false);
    setCheckerNames(selectedBonDeSortie.checkerNames ?? {});
  } else if (isEditing) {
    // 🔄 RESET complet quand nouveau
    setPiece(undefined);
    setManuelle(undefined);
    setMagasin("");
    setDateSortie("");
    setDepartement("");
    setAtelier("");
    setDepot("");
    setSecteur("");
    setCodeArticle("");
    setLibelleArticle("");
    setQuantite(undefined);
    setImputation("");
    setImputationCode("");
    setCommande("");
    setUnite("");

    // ✅ Reset cases et noms
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setLocked1(false);
    setLocked2(false);
    setLocked3(false);
    setCheckerNames({});
  }
}, [selectedBonDeSortie, isEditing]);

  const [modalFor, setModalFor] = useState<number | null>(null);

  const handleCloseModal = () => {
    setModalFor(null);
    setMatricule("");
    setPassword("");
  };

 const handleSave = async () => {
  // Préparer les données à envoyer
  const bonData = {
    piece: piece || 0,
    manuelle: manuelle || 0,
    magasin: magasinValue || "",
    depot: depotValue || "",
    dateSortie: dateSortie || "",
    departement: departementValue || "",
    atelier: atelierValue || "",
    secteur: secteurValue || "",
    codeArticle: codeArticle || "",
    libelleArticle: libelleArticle || "",
    quantite: quantite || 0,
    imputation: imputation || "",
    imputationCode: imputationCode || "",
    commande: commande || "",
    unite: unite || "",
    check1,
    check2,
    check3,
    locked1,
    locked2,
    locked3,
    checkerNames,
  };

  try {
    const res = await fetch("/api/bonDeSortie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bonData),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Erreur lors de l’enregistrement");
      return;
    }

    // 🔹 Mettre à jour la liste des bons de sortie
   // Correct : recrée le tableau complet
setBonsDeSortie([...BonsDeSortie, result.bonDeSortie]);



    // Optionnel : reset formulaire si nécessaire
    setSubmitted(true);
    alert("Bon de sortie enregistré avec succès !");
  } catch (err) {
    console.error(err);
    alert("Erreur de connexion au serveur");
  }
};


  return (
    <ScrollArea h={800} type="scroll">
      <Card shadow="xl" radius={"lg"} mb={8} m={10}>
        <Title order={3}>Bon de sortie</Title>

        {submitted && (
          <div style={{ color: "green", marginBottom: "1rem" }}>
            La demande de bon de sortie a été enregistrée
          </div>
        )}

        <Title order={4} mt="sm">
          Entête
        </Title>
        <Group grow>
          <NumberInput
            label="N° Pièce"
            value={piece}
            onChange={(value: string | number) => {
              const numberValue =
                typeof value === "string" ? parseFloat(value) : value;
              setPiece(numberValue);
            }}
            mt="sm"
            disabled={!isEditing}
          />

          <NumberInput
            label="N° Pièce manuelle"
            value={manuelle}
            onChange={(value: string | number) => {
              const numberValue =
                typeof value === "string" ? parseFloat(value) : value;
              setManuelle(numberValue);
            }}
            mt="sm"
            disabled={!isEditing}
          />

          <TextInput
            label="Date de sortie"
            type="date"
            value={dateSortie}
            onChange={(d) => setDateSortie(d.currentTarget.value)}
            mt="sm"
            disabled={!isEditing}
          />
        </Group>
        <Group grow>
          <Select
            label="Magasin"
            size="sm"
            mt="sm"
            searchable
            data={magasinOptions}
            value={magasinValue ?? ""}
            onChange={setMagasinValue}
            onSearchChange={setMagasinInput}
            onKeyDown={handleMagasinKeyDown}
            placeholder="Sélectionner un magasin"
            disabled={!isEditing}
          />

          <Select
            label="Depot"
            size="sm"
            mt="sm"
            searchable
            data={depotOptions}
            value={depotValue ?? ""}
            onChange={setDepotValue}
            onSearchChange={setDepotInput}
            onKeyDown={handleDepotKeyDown}
            placeholder="Sélectionner ou ajouter un dépôt"
            disabled={!isEditing}
          />

          <Select
            label="Département"
            size="sm"
            mt="sm"
            searchable
            data={departementOptions}
            value={departementValue ?? ""}
            onChange={setDepartementValue}
            onSearchChange={setDepartementInput}
            onKeyDown={handleDeparementKeyDown}
            placeholder="Sélectionner ou ajouter un département"
            disabled={!isEditing}
          />

          <Select
            label="Secteur"
            size="sm"
            mt="sm"
            searchable
            data={secteurOptions}
            value={secteurValue ?? ""}
            onChange={setSecteurValue}
            onSearchChange={setSecteurInput}
            onKeyDown={handleSecteurKeyDown}
            placeholder="Sélectionner ou ajouter un secteur"
            disabled={!isEditing}
          />

          <Select
            label="Atelier"
            size="sm"
            mt="sm"
            searchable
            data={atelierOptions}
            value={atelierValue ?? ""}
            onChange={setAtelierValue}
            onSearchChange={setAtelierInput}
            onKeyDown={handleAtelierKeyDown}
            disabled={!isEditing}
            placeholder="Sélectionner ou ajouter un atelier"
          />
        </Group>

        <Title order={4} mt="md">
          Détails
        </Title>

        <Group grow gap={20}>
          <Group gap="md" mb={-10}>
            <Text w={120} fw={500} mb={-16}>
              Code article
            </Text>
            <Input
              component={IMaskInput}
              mask="M****************************************************************************"
              style={{ width: 400 }}
              value={codeArticle}
              onChange={(e: any) => setCodeArticle(e.target.value)}
              disabled={!isEditing}
            />
          </Group>

          <TextInput
            placeholder="Libellé de l'article"
            label="Libellé article"
            value={libelleArticle}
            onChange={(d) => setLibelleArticle(d.currentTarget.value)}
            mt="sm"
            disabled={!isEditing}
          />
        </Group>

        <Group>
          <NumberInput
            label="Quantité"
            value={quantite}
            onChange={(value: string | number) => {
              const numberValue =
                typeof value === "string" ? parseFloat(value) : value;
              setQuantite(numberValue);
            }}
            mt="sm"
            disabled={!isEditing}
          />

          <TextInput
            label="Unité"
            value={unite}
            onChange={(d) => setUnite(d.currentTarget.value)}
            mt="sm"
            disabled={!isEditing}
          />
        </Group>

        <Group grow>
          <Select
            label="Imputée à:"
            size="sm"
            mt="sm"
            searchable
            data={atelierOptions}
            value={atelierValue}
            onChange={setAtelierValue}
            onSearchChange={setAtelierInput}
            onKeyDown={handleAtelierKeyDown}
            disabled={!isEditing}
            placeholder="Sélectionner ou ajouter un atelier"
          />

          <TextInput
            label="Imputation"
            value={imputationCode}
            onChange={(I) => setImputationCode(I.currentTarget.value)}
            mt="sm"
            disabled={!isEditing}
          />
        </Group>

        <TextInput
          label="Commande"
          value={commande}
          onChange={(c) => setCommande(c.currentTarget.value)}
          mt="sm"
          disabled={!isEditing}
        />

        <Checkbox
          label={
            <>
              Magasinier{" "}
              {checkerNames[1] && (
                <Text span c="black" ml={5}>
                  {checkerNames[1]}
                </Text>
              )}
            </>
          }
          checked={check1}
          onChange={() => handleCheckboxClick(1)}
          disabled={locked1 || !isEditing}
          mt="sm"
        />

        <Checkbox
          label={
            <>
              Directeur{" "}
              {checkerNames[2] && (
                <Text span c="black" ml={5}>
                  {checkerNames[2]}
                </Text>
              )}
            </>
          }
          checked={check2}
          onChange={() => handleCheckboxClick(2)}
          disabled={locked2 || !isEditing}
          mt="sm"
        />

        <Checkbox
          label={
            <>
              Chef{" "}
              {checkerNames[3] && (
                <Text span c="black" ml={5}>
                  {checkerNames[3]}
                </Text>
              )}
            </>
          }
          checked={check3}
          onChange={() => handleCheckboxClick(3)}
          disabled={locked3 || !isEditing}
          mt="sm"
        />

        <Modal
          opened={opened}
          onClose={handleCloseModal}
          title="Connexion"
          centered
        >
          <TextInput
            label="Matricule"
            placeholder="0000"
            value={matricule}
            onChange={(I) => setMatricule(I.currentTarget.value)}
            mb="sm"
          />
          <PasswordInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            mb="sm"
          />

          <Group>
            <Button variant="default" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button onClick={handleLogin} color="#c94b06">
              Confirmer
            </Button>
          </Group>
        </Modal>

        {isEditing && (
          <Group>
            <Button color="#c94B06" onClick={handleSave} mt="sm">
              Enregistrer
            </Button>
          </Group>
        )}
      </Card>
    </ScrollArea>
  );
}
