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
  TextInput,
  Title,
} from "@mantine/core";
import { Manifold } from "./manifold";
import { IconTrash } from "@tabler/icons-react";

// --- TYPES ---
export type Article = {
  id: number;
  NomArticle: string;
  quantite: number | undefined;
  finCompteur: number | undefined;
  unite: string;
  DPU: string;
  imputation: string;
};

// Fonction utilitaire pour créer un article vide
let nextTempId = 1;
const createEmptyArticle = (): Article => ({
  id: nextTempId++,
  NomArticle: "",
  quantite: undefined,
  unite: "",
  imputation: "",
  finCompteur: undefined,
  DPU: "",
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
  Manifold,
  setManifold,
  selectedManifold,
  setSelectedManifold,
  isEditing,
  setIsEditing,
  onSaveAndReturn,
}: Props) {
  // Impression
  const printRef = useRef<HTMLDivElement>(null);
  // ...existing code...
  // ✅ Checkboxes
  const [check1, setCheck1] = useState(false);
  const [locked1, setLocked1] = useState(false);
  const [check2, setCheck2] = useState(false);

  const [locked2, setLocked2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [locked3, setLocked3] = useState(false);
  const [checkerNames, setCheckerNames] = useState<{ [key: number]: string }>(
    {}
  );

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

  const getDefaultArticle = (): Article => ({
    id: Date.now(),
    NomArticle: "",
    quantite: undefined,
    finCompteur: undefined,
    DPU: "",
    unite: "",
    imputation: "",
  });

  // --- ÉTATS ---
  const [Nomarticle, setNomArticle] = useState("");
  const [Demandeur, setDemandeur] = useState("");
  const [recepteur, setRecepteur] = useState("");
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [dateCommande, setDateCommande] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const prevIsEditingRef = useRef<boolean>(isEditing);

  const [locked1, setLocked1] = useState(false);
  const [locked2, setLocked2] = useState(false);
  const [locked3, setLocked3] = useState(false);
  const [checkerNames, setCheckerNames] = useState<{ [key: number]: string }>(
    {}
  );
  const [opened, setOpened] = useState(false);
  const [activeCheckbox, setActiveCheckbox] = useState<number | null>(null);
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");

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

  const handleNewBon = () => {
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

  // --- CHARGEMENT ---
  useEffect(() => {
    if (selectedManifold) {
      setDemandeur(selectedManifold.Demandeur ?? "");
      setRecepteur(selectedManifold.recepteur ?? "");
      setImputation(selectedManifold.Imputation ?? selectedManifold.imputation ?? "");
      setQuantite(selectedManifold.quantite ?? undefined);
      setCode1(selectedManifold.code1 ?? "");
      setCode2(selectedManifold.code2 ?? "");
      setCode3(selectedManifold.code3 ?? "");
      setFinCompteur(selectedManifold.finCompteur ?? undefined);
      setDPU(selectedManifold.DPU ?? "");

      const dateValue = selectedManifold.dateCommande
        ? new Date(selectedManifold.dateCommande).toISOString().split("T")[0]
        : "";
         console.log("Date de commande formatée pour l'input:", dateValue);
      setDateCommande(dateValue);
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
      handleNewBon();
    }
  }, [selectedManifold, isEditing]);

  // --- SAVE ---
  const handleSave = async () => {
    const isUpdating = !!selectedManifold?.id;

    const manifoldData = {
      id: isUpdating ? selectedManifold.id : 0,
      Demandeur,
      recepteur,
      code1,
      code2,
      code3,
      dateCommande,
      check1,
      check2,
      check3,
      locked1,
      locked2,
      locked3,
      checker1_nom: checkerNames[1] || null,
      checker2_nom: checkerNames[2] || null,
      checker3_nom: checkerNames[3] || null,
      articles: articles.map(({ id, ...rest }) => rest),
    };

    const method = isUpdating ? "PUT" : "POST";

    try {
      const res = await fetch("/api/manifold", {
        method: isUpdating ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manifoldData),
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
    const manifoldId = selectedManifold?.id;

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
      const bonId = selectedManifold?.id;

      const bonDataToUpdate = {
        id: manifoldId,
        Demandeur: Demandeur,
        recepteur: recepteur,
        code1: code1,
        code2: code2,
        code3: code3,
        dateCommande: dateCommande,
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

  // --- MODAL LOGIN ---
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

  return (
    <ScrollArea h={900} type="scroll">
      <Card shadow="xl" radius="lg" mb={8} m={10}>
        <div ref={printRef} className="print-area">
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
          <Group justify="space-between" mb="sm">
            <Button
              onClick={handleAddArticle}
              disabled={!isEditing}
              color="#c94b06"
            >
              + Ajouter un article
            </Button>
          </Group>

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
                Employé{" "}
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

          <Divider my="md" label="Confirmations" labelPosition="center" />
          {[1, 2, 3].map((idx) => (
            <Checkbox
              key={idx}
              label={
                <>
                  {idx === 1
                    ? "Magasinier"
                    : idx === 2
                    ? "Responsable Achat"
                    : "Employé"}{" "}
                  {checkerNames[idx] && (
                    <Text span ml={5}>
                      {checkerNames[idx]}
                    </Text>
                  )}
                  {(idx === 1 && locked1) ||
                  (idx === 2 && locked2) ||
                  (idx === 3 && locked3) ? (
                    <Text span ml={6}>
                      🔒
                    </Text>
                  ) : null}
                </>
              }
              checked={idx === 1 ? check1 : idx === 2 ? check2 : check3}
              onChange={() => handleCheckboxClick(idx)}
              disabled={
                !isEditing ||
                (idx === 1 ? locked1 : idx === 2 ? locked2 : locked3)
              }
              mt="sm"
            />
          ))}
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

        {isEditing && (
          <Group mt="md">
            <Button color="#c94b06" onClick={handleSave}>
              💾 Enregistrer
            </Button>
            <Button color="#63687c" onClick={handlePrint} mt={"sm"} variant="outline">
              🖨️ Imprimer
            </Button>
          </Group>
        )}
      </Card>
    </ScrollArea>
  );
}
