"use client";

import React, { useEffect, useRef, useState } from "react";
import { BonDeSortie } from "./BonDeSortie";
import {
  Button,
  Card,
  Checkbox,
  Divider,
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
import { useReactToPrint } from "react-to-print";
import { IconTrash } from "@tabler/icons-react";

const thStyle = {
  border: "1px solid #ccc",
  padding: "6px",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "6px",
};

// --- NOUVEAU TYPE POUR UN ARTICLE ---
export type Article = {
  id: number; // ID temporaire pour la gestion React (key, suppression)
  codeArticle: string;
  libelleArticle: string;
  quantite: number | undefined;
  unite: string;
  imputation: string;
  imputationCode: string | null;
  commande: string;
};

// Fonction utilitaire pour créer un article vide
let nextTempId = 1;
const createEmptyArticle = (): Article => ({
  id: nextTempId++,
  codeArticle: "",
  libelleArticle: "",
  quantite: undefined,
  unite: "",
  imputation: "",
  imputationCode: null,
  commande: "",
});

type Props = {
  BonsDeSortie: BonDeSortie[];
  setBonsDeSortie: React.Dispatch<React.SetStateAction<BonDeSortie[]>>;
  selectedBonDeSortie: BonDeSortie | null;
  setSelectedBonDeSortie: React.Dispatch<
    React.SetStateAction<BonDeSortie | null>
  >;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveAndReturn: (
    updatedBon: BonDeSortie,
    shouldExitEditing?: boolean
  ) => void;
  forceReset: number;
};

export default function BonDeSortieDetails({
  BonsDeSortie,
  setBonsDeSortie,
  selectedBonDeSortie,
  setSelectedBonDeSortie,
  isEditing,
  onSaveAndReturn,
  setIsEditing,
  forceReset,
}: Props) {
  // --- ÉTATS & HOOKS ---
  const [magasinOptions, setMagasinOption] = useState(["Central", "Vato"]);
  const [magasinValue, setMagasinValue] = useState<string | null>(null);
  const [magasinInput, setMagasinInput] = useState("");
  const [type, toggle] = useToggle(["Se connecter", "Créer un compte"]);

  // --- ÉTATS IMPRESSION ---
  const printRef = useRef<HTMLDivElement>(null);
  const [piece, setPiece] = useState<number | undefined>(undefined);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Bon_de_Sortie_${
      typeof piece !== "undefined" ? piece : "Nouveau"
    }`,
  } as any);

  // --- FORMULAIRE D'AUTHENTIFICATION (pour les checks) ---
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

  // --- OPTIONS MAGASIN ---
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

  // --- DEPOT ---
  const [depotOptions, setDepotOptions] = useState([
    "Central",
    "Vato",
    "Mousse",
    "Fer",
  ]);
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

  // --- DÉPARTEMENT ---
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

  // --- ATELIER ---
  const [atelierOptions, setAtelierOptions] = useState([
    "Fer",
    "Dall",
    "Mousse",
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

  // --- SECTEUR ---
  const [secteurOptions, setSecteurOptions] = useState(["AD", "EII", "DD"]);
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

  // --- IMPUTATION CODE (Options communes à tous les articles) ---
  const [ImputationCodeOptions, setImputationCodeOptions] = useState([
    "Secteur",
    "Commande",
    "Code machine",
  ]);
  // L'état de la valeur et de l'input est maintenu ici pour ajouter des options
  const [ImputationCodeInput, setImputationCodeInput] = useState("");
  const handleImputationCodeKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && ImputationCodeInput.trim() !== "") {
      if (!ImputationCodeOptions.includes(ImputationCodeInput)) {
        setImputationCodeOptions((prev) => [...prev, ImputationCodeInput]);
      }
    }
  };

  // --- NOUVEAU: GESTION DES ARTICLES MULTIPLES ---
  const [articles, setArticles] = useState<Article[]>([]);

  const handleAddArticle = () => {
    setArticles((prev) => [...prev, createEmptyArticle()]);
  };

  const handleRemoveArticle = (idToRemove: number) => {
    setArticles((prev) => prev.filter((article) => article.id !== idToRemove));
  };

  const handleArticleChange = (
    idToUpdate: number,
    field: keyof Article,
    value: any
  ) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === idToUpdate ? { ...article, [field]: value } : article
      )
    );
  };
  // -----------------------------------------------------------

  // --- ÉTATS CHECKBOX ---
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [locked1, setLocked1] = useState(false);
  const [locked2, setLocked2] = useState(false);
  const [locked3, setLocked3] = useState(false);
  const [checkerNames, setCheckerNames] = useState<{ [key: number]: string }>(
    {}
  );

  // --- ÉTATS MODAL/CONNEXION ---
  const [opened, setOpened] = useState(false);
  const [activeCheckbox, setActiveCheckbox] = useState<number | null>(null);
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");
  const [manuelle, setManuelle] = useState<number | undefined>(undefined);
  const [dateSortie, setDateSortie] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const prevIsEditingRef = useRef<boolean>(isEditing);

  // --- GESTION MODAL ---
  const handleCheckboxClick = (index: number) => {
    if (!isEditing) return;
    setActiveCheckbox(index);
    setOpened(true);
  };

  const handleCloseModal = () => {
    setOpened(false);
    setActiveCheckbox(null);
    setMatricule("");
    setPassword("");
  };

  // --- GESTION NOUVEAU BON ---
  const handleNewBon = () => {
    // Réinitialiser tous les états locaux pour un nouveau bon
    setPiece(undefined);
    setManuelle(undefined);
    setMagasinValue(null);
    setDepotValue(null);
    setDateSortie("");
    setDepartementValue(null);
    setAtelierValue(null);
    setSecteurValue(null);
    // Réinitialisation des articles: commence avec un article vide
    setArticles([createEmptyArticle()]);

    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setLocked1(false);
    setLocked2(false);
    setLocked3(false);
    setCheckerNames({});

    // Passer en mode édition si ce n'est pas déjà le cas
    setIsEditing(true);
    setSubmitted(false);
  };

  // --- LOGIQUE USEEFFECT ---
  useEffect(() => {
    if (selectedBonDeSortie) {
      // Restaurer tous les champs du bon
      setPiece(selectedBonDeSortie.piece ?? undefined);
      setManuelle(selectedBonDeSortie.manuelle ?? undefined);
      setMagasinValue(selectedBonDeSortie.magasin ?? "");
      setDepotValue(selectedBonDeSortie.depot ?? "");
      setDepartementValue(selectedBonDeSortie.departement ?? "");
      setAtelierValue(selectedBonDeSortie.atelier ?? "");
      setSecteurValue(selectedBonDeSortie.secteur ?? "");

      const dateValue = selectedBonDeSortie.dateSortie
        ? new Date(selectedBonDeSortie.dateSortie).toISOString().split("T")[0]
        : "";
      setDateSortie(dateValue);

      // Restaurer les articles
      const loadedArticles: Article[] =
        selectedBonDeSortie.articles && selectedBonDeSortie.articles.length > 0
          ? selectedBonDeSortie.articles.map((art) => ({
              ...art,
              id: art.id || createEmptyArticle().id,
            }))
          : [createEmptyArticle()];
      setArticles(loadedArticles);

      // Restaurer les états de validation
      setCheck1(selectedBonDeSortie.check1 ?? false);
      setCheck2(selectedBonDeSortie.check2 ?? false);
      setCheck3(selectedBonDeSortie.check3 ?? false);
      setLocked1(selectedBonDeSortie.locked1 ?? false);
      setLocked2(selectedBonDeSortie.locked2 ?? false);
      setLocked3(selectedBonDeSortie.locked3 ?? false);

      // Restaurer les noms des validateurs
      setCheckerNames({
        1: selectedBonDeSortie.checker1_nom ?? "",
        2: selectedBonDeSortie.checker2_nom ?? "",
        3: selectedBonDeSortie.checker3_nom ?? "",
      });

      prevIsEditingRef.current = isEditing;
    } else if (isEditing) {
      // Nouveau bon
      handleNewBon();
    }
    // Ajout de forceReset dans les dépendances pour forcer la réinitialisation
  }, [selectedBonDeSortie, isEditing, forceReset]);

  // --- GESTION ENREGISTREMENT (handleSave) ---
  const handleSave = async () => {
    const isUpdating =
      selectedBonDeSortie?.id !== undefined && selectedBonDeSortie.id !== 0;

    // Préparer l'objet à envoyer en DB
    const bonDataToSend = {
      id: isUpdating ? selectedBonDeSortie?.id : undefined,
      piece: piece ?? 0,
      manuelle: manuelle ?? 0,
      magasin: magasinValue || "",
      depot: depotValue || "",
      dateSortie: dateSortie || "",
      departement: departementValue || "",
      atelier: atelierValue || "",
      secteur: secteurValue || "",

      // Envoi du tableau d'articles. L'API va gérer la suppression de l'ID temporaire
      articles: articles.map(({ id, ...rest }) => rest), // Retirer l'ID temporaire côté client

      check1,
      check2,
      check3,
      locked1,
      locked2,
      locked3,

      checkerNames: checkerNames,
    };

    const method = isUpdating ? "PUT" : "POST";

    try {
      const res = await fetch("/api/bonDeSortie", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bonDataToSend),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Erreur lors de l’enregistrement");
        return;
      }

      // 🎯 Utilisation de la prop onSaveAndReturn
      onSaveAndReturn(result.bonDeSortie);

      setSubmitted(true);
      alert(
        `Bon de sortie ${isUpdating ? "modifié" : "enregistré"} avec succès !`
      );
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    }
  };

  // --- GESTION CONFIRMATION (handleConfirmChecker) ---
  const handleConfirmChecker = async (checkboxIndex: number) => {
    if (!matricule || !password) {
      alert("Matricule et mot de passe requis");
      return;
    }

    // --- 1. Autorisation par Matricule ---
    const allowedAccounts: { [key: number]: string } = {
      1: "5631", // Magasinier
      2: "2i2", // Directeur
      3: "2i33", // Chef
    };

    const inputMatricule = matricule.trim();

    if (allowedAccounts[checkboxIndex] !== inputMatricule) {
      alert("Votre matricule n'est pas autorisé à confirmer ce checkbox !");
      setMatricule("");
      setPassword("");
      return;
    }

    try {
      // --- 2. Authentification API ---
      const res = await fetch("/api/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricule: inputMatricule,
          password,
          type: "Se Connecter",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(
          data.message || "Authentification échouée (Mot de passe incorrect ?)"
        );
        setMatricule("");
        setPassword("");
        return;
      }

      const userName = data.user?.nom ?? data.name ?? "Utilisateur";

      // --- 3. Mise à jour de l'état local (Check et Lock) ---
      let newCheck1 = check1,
        newCheck2 = check2,
        newCheck3 = check3;
      let newLocked1 = locked1,
        newLocked2 = locked2,
        newLocked3 = locked3;

      const newCheckerNames = { ...checkerNames };
      newCheckerNames[checkboxIndex] = userName;

      if (checkboxIndex === 1) {
        newCheck1 = true;
        newLocked1 = true;
        setCheck1(true);
        setLocked1(true);
      } else if (checkboxIndex === 2) {
        newCheck2 = true;
        newLocked2 = true;
        setCheck2(true);
        setLocked2(true);
      } else if (checkboxIndex === 3) {
        newCheck3 = true;
        newLocked3 = true;
        setCheck3(true);
        setLocked3(true);
      }
      setCheckerNames(newCheckerNames);

      // --- 4. Mise à jour DB (PUT) ---
      const bonId = selectedBonDeSortie?.id;

      // Création d'un objet complet à envoyer (avec le tableau d'articles)
      const bonDataToUpdate = {
        id: bonId,
        piece: piece ?? 0,
        manuelle: manuelle ?? 0,
        magasin: magasinValue || "",
        depot: depotValue || "",
        dateSortie: dateSortie || "",
        departement: departementValue || "",
        atelier: atelierValue || "",
        secteur: secteurValue || "",

        articles: articles.map(({ id, ...rest }) => rest), // Retirer l'ID temporaire

        check1: newCheck1,
        check2: newCheck2,
        check3: newCheck3,
        locked1: newLocked1,
        locked2: newLocked2,
        locked3: newLocked3,

        checkerNames: newCheckerNames, // L'API gérera la conversion en checkerX_nom
      };

      const putResponse = await fetch("/api/bonDeSortie", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bonDataToUpdate),
      });

      const putResult = await putResponse.json();

      if (!putResponse.ok) {
        alert(putResult.message || "Erreur lors de la mise à jour des checks.");
        return;
      }

      onSaveAndReturn(putResult.bonDeSortie, false);

      setOpened(false);
      setActiveCheckbox(null);
      setMatricule("");
      setPassword("");
      alert(`Confirmé par ${userName}`);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  // --- RENDU ---
  return (
    <ScrollArea h={700} type="scroll">
      <Card shadow="xl" radius={"lg"} mb={8} m={10}>
        {/* 👇 Contenu à imprimer */}
        <div className="form-area">
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
          
            <Divider my="md" label="Articles" labelPosition="center" />
          
          {isEditing && (
            <Title order={4} mt="md">
              Détails des Articles
            </Title>
          )}
          {articles.map((article, index) => (
            <Card
              key={article.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              mb="lg"
              style={{
                borderLeft: "5px solid #c94b06",
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
              }}
            >
              <Group justify="space-between">
                <Title order={5}>Article n°{index + 1}</Title>
                {isEditing && articles.length > 1 && (
                  <Button
                    variant="light"
                    color="red"
                    onClick={() => handleRemoveArticle(article.id)}
                  >
                    <IconTrash size={16} />
                  </Button>
                )}
              </Group>

              <Group grow align="end" gap="md" mt={10}>
                <div style={{ flex: 1 }}>
                  <Text fw={500} mb={0}>
                    Code article
                  </Text>
                  <Input
                    component={IMaskInput}
                    mask="M****************************************************************************"
                    value={article.codeArticle}
                    onChange={(e: any) =>
                      handleArticleChange(
                        article.id,
                        "codeArticle",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div style={{ flex: 2 }}>
                  <TextInput
                    label="Libellé article"
                    placeholder="Libellé de l'article"
                    value={article.libelleArticle}
                    onChange={(d) =>
                      handleArticleChange(
                        article.id,
                        "libelleArticle",
                        d.currentTarget.value
                      )
                    }
                    disabled={!isEditing}
                  />
                </div>
              </Group>

              <Group grow>
                <NumberInput
                  label="Quantité"
                  value={article.quantite}
                  onChange={(value: string | number) => {
                    const numberValue =
                      typeof value === "string" ? parseFloat(value) : value;
                    handleArticleChange(article.id, "quantite", numberValue);
                  }}
                  mt="sm"
                  disabled={!isEditing}
                />

                <TextInput
                  label="Unité"
                  value={article.unite}
                  onChange={(d) =>
                    handleArticleChange(
                      article.id,
                      "unite",
                      d.currentTarget.value
                    )
                  }
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
                  data={ImputationCodeOptions}
                  value={article.imputationCode}
                  onChange={(value) =>
                    handleArticleChange(article.id, "imputationCode", value)
                  }
                  onSearchChange={setImputationCodeInput}
                  onKeyDown={handleImputationCodeKeyDown}
                  disabled={!isEditing}
                  placeholder="Sélectionner ou ajouter une imputation"
                />

                <TextInput
                  label="Imputation"
                  value={article.imputation}
                  onChange={(I) =>
                    handleArticleChange(
                      article.id,
                      "imputation",
                      I.currentTarget.value
                    )
                  }
                  mt="sm"
                  disabled={!isEditing}
                />
              </Group>

              <TextInput
                label="Commande"
                value={article.commande}
                onChange={(c) =>
                  handleArticleChange(
                    article.id,
                    "commande",
                    c.currentTarget.value
                  )
                }
                mt="sm"
                disabled={!isEditing}
              />
            </Card>
          ))}

          {/* Bouton pour ajouter un article */}
          {isEditing && (
            <Group justify="space-between" mb="sm">
              <Button
                onClick={handleAddArticle}
                disabled={!isEditing}
                color="#c94b06"
              >
                + Ajouter un article
              </Button>
            </Group>
          )}
          {/* Fin des détails des articles */}

          <Divider my="md" label="Confirmations" labelPosition="center" />

          <Checkbox
            label={
              <>
                Magasinier{" "}
                {checkerNames[1] && (
                  <Text span ml={5}>
                    {checkerNames[1]}
                  </Text>
                )}{" "}
                {(check1 || locked1) && (
                  <Text span ml={6}>
                    🔒
                  </Text>
                )}
              </>
            }
            checked={check1}
            onChange={() => handleCheckboxClick(1)}
            disabled={!isEditing || check1 || locked1}
            mt="sm"
          />

          <Checkbox
            label={
              <>
                Responsable achat{" "}
                {checkerNames[2] && (
                  <Text span ml={5}>
                    {checkerNames[2]}
                  </Text>
                )}
                {(check2 || locked2) && (
                  <Text span ml={6}>
                    🔒
                  </Text>
                )}
              </>
            }
            checked={check2}
            onChange={() => handleCheckboxClick(2)}
            disabled={!isEditing || check2 || locked2}
            mt="sm"
          />

          <Checkbox
            label={
              <>
                Receptionnaire{" "}
                {checkerNames[3] && (
                  <Text span ml={5}>
                    {checkerNames[3]}
                  </Text>
                )}
                {(check3 || locked3) && (
                  <Text span ml={6}>
                    🔒
                  </Text>
                )}
              </>
            }
            checked={check3}
            onChange={() => handleCheckboxClick(3)}
            disabled={!isEditing || check3 || locked3}
            mt="sm"
          />
        </div>

        <Modal
          opened={opened}
          onClose={handleCloseModal}
          title="Connexion"
          centered
        >
          <TextInput
            label="Matricule"
            value={matricule}
            onChange={(e) => setMatricule(e.currentTarget.value)}
          />
          <PasswordInput
            label="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Group mt="md" justify="flex-end">
            <Button variant="default" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button
              onClick={() => handleConfirmChecker(activeCheckbox!)}
              color="#c94b06"
            >
              Confirmer
            </Button>
          </Group>
        </Modal>

        <div style={{ display: "none" }}>
          {/* --- Version imprimable (invisible à l'écran) --- */}
          <div
            ref={printRef}
            className="print-area"
            style={{ padding: "20px" }}
          >
            <Title order={3} ta="center" mb="md">
              Bon de Sortie N° {selectedBonDeSortie?.id ?? "—"}
            </Title>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "1rem",
              }}
            >
              <tbody>
                <tr>
                  <td>
                    <strong>Date de sortie :</strong>
                  </td>
                  <td>{dateSortie || "—"}</td>
                  <td>
                    <strong>Magasin :</strong>
                  </td>
                  <td>{magasinValue || "—"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Dépôt :</strong>
                  </td>
                  <td>{depotValue || "—"}</td>
                  <td>
                    <strong>Département :</strong>
                  </td>
                  <td>{departementValue || "—"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Atelier :</strong>
                  </td>
                  <td>{atelierValue || "—"}</td>
                  <td>
                    <strong>Secteur :</strong>
                  </td>
                  <td>{secteurValue || "—"}</td>
                </tr>
              </tbody>
            </table>

            <Title order={4} mb="xs">
              Liste des articles
            </Title>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={thStyle}>N° Bon</th>
                  <th style={tdStyle}>Code Article</th>
                  <th style={tdStyle}>Libellé</th>
                  <th style={tdStyle}>Qté</th>
                  <th style={tdStyle}>Unité</th>
                  <th style={tdStyle}>Imputation</th>
                  <th style={tdStyle}>Commande</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a, idx) => (
                  <tr key={a.id}>
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={tdStyle}>{a.codeArticle}</td>
                    <td style={tdStyle}>{a.libelleArticle}</td>
                    <td style={tdStyle}>{a.quantite !== undefined ? a.quantite.toString() : ''}</td>
                    <td style={tdStyle}>{a.unite}</td>
                    <td style={tdStyle}>
                      {a.imputationCode} - {a.imputation}
                    </td>
                    <td style={tdStyle}>{a.commande}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Divider my="md" />

            <table
              style={{ width: "100%", textAlign: "center", marginTop: "2rem" }}
            >
              <tbody>
                <tr>
                  <td>
                    <strong>Magasinier</strong>
                  </td>
                  <td>
                    <strong>Responsable Achat</strong>
                  </td>
                  <td>
                    <strong>Employé</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ height: "60px" }}>
                    {checkerNames[1] || ""} {check1 && "✅"}
                  </td>
                  <td>
                    {checkerNames[2] || ""} {check2 && "✅"}
                  </td>
                  <td>
                    {checkerNames[3] || ""} {check3 && "✅"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {isEditing && (
          <Group>
            <Button color="#c94b06" onClick={handleSave} mt="sm">
              Enregistrer
            </Button>
            <Button color="#63687c" onClick={handlePrint} mt="sm">
              🖨️ Imprimer
            </Button>
          </Group>
        )}
      </Card>
    </ScrollArea>
  );
}
