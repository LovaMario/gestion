"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { Manifold } from "./manifold";
import { IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { Article } from "../manifold/manifold";
// Fonction utilitaire pour créer un article vide
let nextTempId = 1;
const createEmptyArticle = (): Article => ({
  id: nextTempId++,
  NomArticle: "",
  quantite: 0,
  unite: "",
  finCompteur: 0,
  DPU: "",
  imputation: "",
});

type Props = {
  Manifold: Manifold[];
  setManifold: (newList: Manifold[]) => void;
  selectedManifold: Manifold | null;
  setSelectedManifold: React.Dispatch<React.SetStateAction<Manifold | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveAndReturn: (
    updatedManifold: Manifold,
    shouldExitEditing?: boolean
  ) => void;
};

export default function ManifoldDetails({
  selectedManifold,
  isEditing,
  setIsEditing,
  onSaveAndReturn,
}: Props) {
  const thStyle = {
    border: "1px solid #ccc",
    padding: "6px",
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "6px",
    justifyContent: "center",
  };

  const [type, toggle] = useToggle(["Se connecter", "Créer un compte"]);

  // --- REF POUR IMPRESSION ---
  // --- IMPRESSION ---
  const printRef = useRef<HTMLDivElement>(null);
  const [quantite, setQuantite] = useState<number | undefined>(undefined);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `manifold_${
      typeof quantite !== "undefined" ? quantite : "Nouveau"
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
  const [motif, setMotif] = useState("");
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

  const handleNewManifold = () => {
    // Réinitialiser tous les états locaux pour un nouveau manifold
    setDemandeur("");
    setRecepteur("");
    setCode1("");
    setCode2("");
    setCode3("");
    setDateCommande("");
    setQuantite(undefined);
    setNomArticle("");

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

  // --- ÉTATS ---
  const [NomArticle, setNomArticle] = useState("");
  const [Demandeur, setDemandeur] = useState("");
  const [recepteur, setRecepteur] = useState("");
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [dateCommande, setDateCommande] = useState("");

  // --- CHARGEMENT ---
  useEffect(() => {
    if (selectedManifold) {
      setDemandeur(selectedManifold.Demandeur ?? "");
      setRecepteur(selectedManifold.recepteur ?? "");
      setCode1(selectedManifold.code1 ?? "");
      setCode2(selectedManifold.code2 ?? "");
      setCode3(selectedManifold.code3 ?? "");
      setDateCommande(selectedManifold.dateCommande ?? "");
      setMotif(selectedManifold.motif ?? "");

      const dateValue = selectedManifold.dateCommande
        ? new Date(selectedManifold.dateCommande).toISOString().split("T")[0]
        : "";
      setDateCommande(dateValue);

      const loadedArticles: Article[] =
        selectedManifold.articles && selectedManifold.articles.length > 0
          ? selectedManifold.articles.map((art) => ({
              ...art,
              id: art.id || createEmptyArticle().id,
            }))
          : [createEmptyArticle()];
      setArticles(loadedArticles);

      setCheck1(selectedManifold.check1 ?? false);
      setCheck2(selectedManifold.check2 ?? false);
      setCheck3(selectedManifold.check3 ?? false);
      setLocked1(selectedManifold.locked1 ?? false);
      setLocked2(selectedManifold.locked2 ?? false);
      setLocked3(selectedManifold.locked3 ?? false);

      setCheckerNames({
        1: selectedManifold.checker1_nom ?? "",
        2: selectedManifold.checker2_nom ?? "",
        3: selectedManifold.checker3_nom ?? "",
      });

      prevIsEditingRef.current = isEditing;
    } else if (isEditing) {
      // Nouveau bon
      handleNewManifold();
    }
  }, [selectedManifold, isEditing]);

  // --- SAVE ---
  const handleSave = async () => {
    const isUpdating =
      selectedManifold?.id !== undefined && selectedManifold.id !== 0;

    const manifoldDataToSend = {
      id: isUpdating ? selectedManifold.id : undefined,
      Demandeur: Demandeur,
      recepteur: recepteur,
      code1: code1 ?? 0,
      code2: code2 ?? 0,
      code3: code3 ?? 0,
      dateCommande: dateCommande || "",
      motif,

      articles: articles.map(({ id, ...rest }) => rest),

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
      const res = await fetch("/api/manifold", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manifoldDataToSend),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Erreur lors de l’enregistrement");
        return;
      }

      // 🎯 Utilisation de la prop onSaveAndReturn
      onSaveAndReturn(result.bonDeSortie);

      setSubmitted(true);
      alert(`Manifold ${isUpdating ? "modifié" : "enregistré"} avec succès !`);
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    }
  };

  // --- CONFIRM CHECKER ---
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
      const manifoldId = selectedManifold?.id;

      const manifoldDataToUpdate = {
        id: manifoldId,
        Demandeur: Demandeur,
        recepteur: recepteur,
        code1: code1 ?? 0,
        code2: code2 ?? 0,
        code3: code3 ?? 0,
        dateCommande: dateCommande || "",
        motif,

        articles: articles.map(({ id, ...rest }) => rest),

        check1: newCheck1,
        check2: newCheck2,
        check3: newCheck3,
        locked1: newLocked1,
        locked2: newLocked2,
        locked3: newLocked3,

        checkerNames: newCheckerNames,
      };

      const putResponse = await fetch("/api/manifold", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manifoldDataToUpdate),
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

  return (
    <ScrollArea h={800} type="scroll">
      <Card shadow="xl" radius="lg" mb={8} m={10}>
        <div className="form-area">
          <Title order={3}>Manifold</Title>

          {submitted && (
            <div style={{ color: "green", marginBottom: "1rem" }}>
              Manifold enregistrée
            </div>
          )}

          <Title order={4} mt="sm">
            Entête
          </Title>
          <Group grow>
            <TextInput
              label="De"
              value={Demandeur}
              onChange={(e) => setDemandeur(e.currentTarget.value)}
              disabled={!isEditing}
            />
            <TextInput
              label="Code 1 (Demandeur)"
              value={code1}
              onChange={(e) => setCode1(e.currentTarget.value)}
              disabled={!isEditing}
            />
          </Group>

          <Group grow mt="sm">
            <TextInput
              label="À"
              value={recepteur}
              onChange={(e) => setRecepteur(e.currentTarget.value)}
              disabled={!isEditing}
            />
            <TextInput
              label="Code 2 (Recepteur)"
              value={code2}
              onChange={(e) => setCode2(e.currentTarget.value)}
              disabled={!isEditing}
            />
          </Group>

          <Group grow mt="sm">
            <TextInput
              label="Date commande"
              type="date"
              value={dateCommande}
              onChange={(e) => setDateCommande(e.currentTarget.value)}
              disabled={!isEditing}
            />
            <TextInput
              label="Code Machine"
              value={code3}
              onChange={(e) => setCode3(e.currentTarget.value)}
              disabled={!isEditing}
            />
          </Group>
          
            <Divider my="md" label="Articles" labelPosition="center" />
          

          {articles.map((art, i) => (
            <Card
              key={art.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              mb="lg"
              style={{
                borderLeft: "5px solid #c94b06",
                backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white",
              }}
            >
              <Group justify="space-between">
                <Title order={5}>Article n°{i + 1}</Title>
                {isEditing && articles.length > 1 && (
                  <Button
                    variant="light"
                    color="red"
                    onClick={() => handleRemoveArticle(art.id)}
                  >
                    <IconTrash size={16} />
                  </Button>
                )}
              </Group>
              <TextInput
                placeholder="Nom article"
                label="Nom article"
                value={art.NomArticle}
                onChange={(d) =>
                  handleArticleChange(
                    art.id,
                    "NomArticle",
                    d.currentTarget.value
                  )
                }
                mt="sm"
                disabled={!isEditing}
              />
              <Group grow mt="sm">
                <NumberInput
                  label="Quantité"
                  value={art.quantite}
                  onChange={(value: string | number) => {
                    const numberValue =
                      typeof value === "string" ? parseFloat(value) : value;
                    handleArticleChange(art.id, "quantite", numberValue);
                  }}
                  mt="sm"
                  disabled={!isEditing}
                />
                <TextInput
                  label="Unité"
                  value={art.unite}
                  onChange={(d) =>
                    handleArticleChange(art.id, "unite", d.currentTarget.value)
                  }
                  mt="sm"
                  disabled={!isEditing}
                />
                <TextInput
                  label="imputation"
                  value={art.imputation ?? ""}
                  onChange={(i) =>
                    handleArticleChange(
                      art.id,
                      "imputation",
                      i.currentTarget.value
                    )
                  }
                  mt="sm"
                  disabled={!isEditing}
                />
              </Group>
              <TextInput
                placeholder="DPU"
                label="DPU"
                value={art.DPU}
                onChange={(d) =>
                  handleArticleChange(art.id, "DPU", d.currentTarget.value)
                }
                mt="sm"
                disabled={!isEditing}
              />
              <NumberInput
                label="Fin Compteur"
                value={art.finCompteur}
                onChange={(value: string | number) => {
                  const numberValue =
                    typeof value === "string" ? parseFloat(value) : value;
                  handleArticleChange(art.id, "finCompteur", numberValue);
                }}
                mt="sm"
                disabled={!isEditing}
              />
            </Card>
          ))}

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

          <Textarea
            autosize
            placeholder="Motif de la demande"
            value={motif}
            onChange={(e) => setMotif(e.currentTarget.value)}
            disabled={!isEditing}
            mt="sm"
          />

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

        {/* MODAL LOGIN */}
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
              Manifold N° {selectedManifold?.id ?? "—"}
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
                    <strong>De :</strong>
                  </td>
                  <td>{Demandeur || "—"}</td>
                  <td></td>
                  <td>
                    <strong>Date :</strong>
                  </td>
                  <td>{dateCommande || "—"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>A :</strong>
                  </td>
                  <td>{recepteur || "—"}</td>
                  <td></td>
                  <td>
                    <strong>Code du Demandeur :</strong>
                  </td>
                  <td>{code1 || "—"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Code Machine :</strong>
                  </td>
                  <td>{code3 || "—"}</td>
                  <td></td>
                  <td>
                    <strong>Code du Recepteur :</strong>
                  </td>
                  <td>{code2 || "—"}</td>
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
                  <th style={thStyle}>Art N°</th>
                  <th style={thStyle}>Article</th>
                  <th style={thStyle}>Fin Compteur </th>
                  <th style={thStyle}>Imputation </th>
                  <th style={thStyle}>Quantité</th>
                  <th style={thStyle}>Unité</th>
                  <th style={thStyle}>Commande</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a, idx) => (
                  <tr key={a.id}>
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={tdStyle}>{a.NomArticle}</td>
                    <td style={tdStyle}>{a.finCompteur}</td>
                    <td style={tdStyle}>{a.imputation}</td>
                    <td style={tdStyle}>{a.quantite}</td>
                    <td style={tdStyle}>{a.unite}</td>
                    <td style={tdStyle}>{a.DPU}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>Motif : {motif}</div>

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
          <Group mt="md">
            <Button color="#c94b06" onClick={handleSave}>
              💾 Enregistrer
            </Button>
            <Button color="#63687c" onClick={handlePrint}>
              🖨️ Imprimer
            </Button>
          </Group>
        )}
      </Card>
    </ScrollArea>
  );
}
