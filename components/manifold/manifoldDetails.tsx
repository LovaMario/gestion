"use client";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Button,
  Card,
  Checkbox,
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
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";

type Props = {
  Manifold: Manifold[];
  setManifold: (newList: Manifold[]) => void;
  selectedManifold: Manifold | null;
  setSelectedManifold: React.Dispatch<React.SetStateAction<Manifold | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveAndReturn: (
    updatedmanifold: Manifold,
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

  // --- ÉTATS MODAL/CONNEXION ---
  const [opened, setOpened] = useState(false);
  const [activeCheckbox, setActiveCheckbox] = useState<number | null>(null);
  const [modalFor, setModalFor] = useState<number | null>(null);
  const [matricule, setMatricule] = useState<string>("");
  const [password, setPassword] = useState("");

  // Champs Manifold
  const [NomArticle, setNomArticle] = useState("");
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Manifold_${NomArticle ? NomArticle : "Nouveau"}`,
  } as any);
  const [Demandeur, setDemandeur] = useState("");
  const [recepteur, setRecepteur] = useState("");
  const [Imputation, setImputation] = useState("");
  const [quantite, setQuantite] = useState<number | undefined>(undefined);
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [finCompteur, setFinCompteur] = useState<number | undefined>(undefined);
  const [DPU, setDPU] = useState("");
  const [dateCommande, setDateCommande] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // pour gérer reset seulement quand on entre en edition
  const prevIsEditingRef = useRef<boolean>(isEditing);

  // --- GESTION MODAL ---

  const handleCheckboxClick = (index: number) => {
    if (!isEditing) return;
    setActiveCheckbox(index);
    setOpened(true);
  };

  // --- GESTION NOUVEAU BON ---

  // Harmonisation avec BonDeSortieDetails
  const handleNewManifold = () => {
    setDemandeur("");
    setRecepteur("");
    setImputation("");
    setCode1("");
    setCode2("");
    setCode3("");
    setFinCompteur(undefined);
    setDPU("");
    setDateCommande("");
    setQuantite(undefined);
    setNomArticle("");
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setLocked1(false);
    setLocked2(false);
    setLocked3(false);
    setCheckerNames({ 1: "", 2: "", 3: "" });
    setIsEditing(true);
    setSubmitted(false);
  };

  // Initialisation ou reset
  useEffect(() => {
    if (selectedManifold) {
      setNomArticle(selectedManifold.NomArticle ?? "");
      setDemandeur(selectedManifold.Demandeur ?? "");
      setRecepteur(selectedManifold.recepteur ?? "");
      setImputation(selectedManifold.Imputation ?? "");
      setQuantite(selectedManifold.quantite ?? undefined);
      setCode1(selectedManifold.code1 ?? "");
      setCode2(selectedManifold.code2 ?? "");
      setCode3(selectedManifold.code3 ?? "");
      setFinCompteur(selectedManifold.finCompteur ?? undefined);
      setDPU(selectedManifold.DPU ?? "");
      setDateCommande(selectedManifold.dateCommande ?? "");
      setCheck1(selectedManifold.check1 ?? false);
      setLocked1(selectedManifold.locked1 ?? false);
      setCheck2(selectedManifold.check2 ?? false);
      setLocked2(selectedManifold.locked2 ?? false);
      setCheck3(selectedManifold.check3 ?? false);
      setLocked3(selectedManifold.locked3 ?? false);
      setCheckerNames({
        1: selectedManifold.checker1_nom ?? "",
        2: selectedManifold.checker2_nom ?? "",
        3: selectedManifold.checker3_nom ?? "",
      });
    } else if (isEditing) {
      handleNewManifold();
    }
  }, [selectedManifold, isEditing]);

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
      // Ces mises à jour d'état local sont cruciales
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

      // --- 4. Mise à jour locale uniquement (pas d'enregistrement DB ici)
      setCheck1(newCheck1);
      setCheck2(newCheck2);
      setCheck3(newCheck3);
      setLocked1(newLocked1);
      setLocked2(newLocked2);
      setLocked3(newLocked3);
      setCheckerNames(newCheckerNames);
      setOpened(false);
      setActiveCheckbox(null);
      setMatricule("");
      setPassword("");
      setIsEditing(true);
      alert(`Confirmé par ${userName}`);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const handleCloseModal = () => {
    setOpened(false);
    setActiveCheckbox(null);
    setModalFor(null);
    setMatricule("");
    setPassword("");
  };

  const handleLogin = async () => {
    // 🔹 Ici tu peux faire ton fetch API réel
    console.log("Login check for checkbox", modalFor, matricule, password);

    if (modalFor === 1) {
      setCheck1(true);
      setLocked1(true);
    } else if (modalFor === 2) {
      setCheck2(true);
      setLocked2(true);
    } else if (modalFor === 3) {
      setCheck3(true);
      setLocked3(true);
    }
    setModalFor(null);
    setMatricule("");
    setPassword("");
  };

  // Nouvelle logique d'enregistrement harmonisée avec BonDeSortieDetails
  const handleSave = async () => {
    const isUpdating =
      selectedManifold?.id !== undefined && selectedManifold.id !== 0;
    const manifoldDataToSend = {
      id: isUpdating ? selectedManifold?.id : undefined,
      Demandeur: Demandeur || "",
      recepteur: recepteur || "",
      code1: code1 ?? 0,
      code2: code2 ?? 0,
      code3: code3 ?? 0,
      NomArticle: NomArticle || "",
      finCompteur: finCompteur || "",
      DPU: DPU ?? 0,
      dateCommande: dateCommande || "",
      quantite: quantite ?? 0,
      imputation: Imputation || "",
      check1,
      check2,
      check3,
      locked1,
      locked2,
      locked3,
      checkerNames: checkerNames,
      checker1_nom: checkerNames[1] || null,
      checker2_nom: checkerNames[2] || null,
      checker3_nom: checkerNames[3] || null,
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
      onSaveAndReturn(result.manifold);
      setSubmitted(true);
      alert(`Manifold ${isUpdating ? "modifié" : "enregistré"} avec succès !`);
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    }
  };

  return (
    <ScrollArea h={800} type="always">
      <Card shadow="xl" radius="lg" mb={8} m={10}>
        
        {/* 👇 Contenu à imprimer */}
        <div ref={printRef}>
          <Title order={3}>Manifold</Title>
          {submitted && (
            <div style={{ color: "green", marginBottom: 10 }}>
              Manifold enregistré !
            </div>
          )}
          {/* ...le reste du contenu à imprimer... */}
        

        <Group grow>
          <TextInput
            label="Demandeur"
            value={Demandeur}
            onChange={(d) => setDemandeur(d.currentTarget.value)}
            disabled={!isEditing}
            mt="sm"
          />
          <TextInput
            label="Code 1"
            value={code1}
            onChange={(d) => setCode1(d.currentTarget.value)}
            disabled={!isEditing}
            mt="sm"
          />
        </Group>

        <Group grow>
          <TextInput
            label="Recepteur"
            value={recepteur}
            onChange={(d) => setRecepteur(d.currentTarget.value)}
            disabled={!isEditing}
            mt="sm"
          />
          <TextInput
            label="Code 2"
            value={code2}
            onChange={(d) => setCode2(d.currentTarget.value)}
            disabled={!isEditing}
            mt="sm"
          />
        </Group>

        <Group grow>
          <TextInput
            label="Imputation"
            value={Imputation}
            onChange={(d) => setImputation(d.currentTarget.value)}
            disabled={!isEditing}
            mt="sm"
          />
          <TextInput
            label="Code 3"
            value={code3}
            onChange={(d) => setCode3(d.currentTarget.value)}
            disabled={!isEditing}
            mt="sm"
          />
        </Group>

        <NumberInput
          label="Fin compteur"
          value={finCompteur}
          onChange={(value: string | number) => {
            const numberValue =
              typeof value === "string" ? parseFloat(value) : value;
            setFinCompteur(numberValue);
          }}
          mt="sm"
          disabled={!isEditing}
        />
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
          label="Nom Article"
          value={NomArticle}
          onChange={(d) => setNomArticle(d.currentTarget.value)}
          disabled={!isEditing}
          mt="sm"
        />
        <TextInput
          label="DPU"
          value={DPU}
          onChange={(d) => setDPU(d.currentTarget.value)}
          disabled={!isEditing}
          mt="sm"
        />
        <TextInput
          label="Date de commande"
          type="date"
          value={dateCommande}
          onChange={(d) => setDateCommande(d.currentTarget.value)}
          disabled={!isEditing}
          mt="sm"
        />

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
              Directeur{" "}
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
              Chef{" "}
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

        {isEditing && (
          <Group>
          <Button color="#63687c" onClick={handlePrint} mt={"sm"}>
            🖨️ Imprimer
          </Button>
            <Button color="#c94B06" onClick={handleSave} mt="sm">
              Enregistrer
            </Button>
          </Group>
        )}
      </Card>
    </ScrollArea>
  );
}
