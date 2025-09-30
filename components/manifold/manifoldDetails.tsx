"use client";

import React, { useEffect, useState } from "react";
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

type Props = {
  Manifold: Manifold[];
  setManifold: (newList: Manifold[]) => void;
  selectedManifold: Manifold | null;
  setSelectedManifold: React.Dispatch<React.SetStateAction<Manifold | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ManifoldDetails({
  Manifold,
  setManifold,
  selectedManifold,
  setSelectedManifold,
  isEditing,
  setIsEditing,
}: Props) {
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

  // Modal : null = fermé, 1|2|3 = pour la checkbox correspondante
  const [modalFor, setModalFor] = useState<number | null>(null);
  const [matricule, setMatricule] = useState<string>("");
  const [password, setPassword] = useState("");

  // Champs Manifold
  const [NomArticle, setNomArticle] = useState("");
  const [Demandeur, setDemandeur] = useState("");
  const [recepteur, setRecepeteur] = useState("");
  const [Imputation, setImputation] = useState("");
  const [quantite, setQuantite] = useState<number | undefined>(undefined);
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [finCompteur, setFinCompteur] = useState("");
  const [DPU, setDPU] = useState("");
  const [dateCommande, setDateCommande] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Initialisation ou reset
  useEffect(() => {
    if (selectedManifold) {
      setNomArticle(selectedManifold.NomArticle ?? "");
      setDemandeur(selectedManifold.Demandeur ?? "");
      setRecepeteur(selectedManifold.recepteur ?? "");
      setImputation(selectedManifold.Imputation ?? "");
      setQuantite(selectedManifold.quantite ?? undefined);
      setCode1(selectedManifold.code1 ?? "");
      setCode2(selectedManifold.code2 ?? "");
      setCode3(selectedManifold.code3 ?? "");
      setFinCompteur(selectedManifold.finCompteur ?? "");
      setDPU(selectedManifold.DPU ?? "");
      setDateCommande(selectedManifold.dateCommande ?? "");
      // flags checkboxes si présents
      setCheck1(selectedManifold.check1 ?? false);
      setLocked1(selectedManifold.locked1 ?? false);
      setCheck2(selectedManifold.check2 ?? false);
      setLocked2(selectedManifold.locked2 ?? false);
      setCheck3(selectedManifold.check3 ?? false);
      setLocked3(selectedManifold.locked3 ?? false);
    } else if (isEditing) {
      setNomArticle("");
      setDemandeur("");
      setRecepeteur("");
      setImputation("");
      setQuantite(undefined);
      setCode1("");
      setCode2("");
      setCode3("");
      setFinCompteur("");
      setDPU("");
      setDateCommande("");
      setCheck1(false);
      setLocked1(false);
      setCheck2(false);
      setLocked2(false);
      setCheck3(false);
      setLocked3(false);
    }
  }, [selectedManifold, isEditing]);


  const handleCheckboxClick = (index: number) => {
    if (
      (index === 1 && !locked1) ||
      (index === 2 && !locked2) ||
      (index === 3 && !locked3)
    ) {
      setModalFor(index); // ✅ ouvrir le modal
    }
  };

  const handleCloseModal = () => {
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

  const handleSave = () => {
    const manifoldData: Manifold = {
      id: selectedManifold?.id ?? Date.now(),
      NomArticle,
      Demandeur,
      recepteur,
      Imputation,
      quantite: quantite ?? 0,
      code1,
      code2,
      code3,
      finCompteur,
      DPU,
      dateCommande,
      check1,
      check2,
      check3,
      locked1,
      locked2,
      locked3,
    };

    if (selectedManifold) {
      const updatedList = Manifold.map((m) =>
        m.id === selectedManifold.id ? manifoldData : m
      );
      setManifold(updatedList);
      setSelectedManifold(manifoldData);
    } else {
      const newList = [...Manifold, manifoldData];
      setManifold(newList);
      setSelectedManifold(manifoldData);
    }

    setIsEditing(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <ScrollArea h={800} type="always">
      <Card shadow="xl" radius="lg" mb={8} m={10}>
        <Title order={3}>Manifold</Title>
        {submitted && (
          <div style={{ color: "green", marginBottom: 10 }}>
            Manifold enregistré !
          </div>
        )}

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
            onChange={(d) => setRecepeteur(d.currentTarget.value)}
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

        <TextInput
          label="Fin compteur"
          value={finCompteur}
          onChange={(d) => setFinCompteur(d.currentTarget.value)}
          disabled={!isEditing}
           mt="sm"
        />
        <NumberInput
          label="Quantité"
          value={quantite}
          onChange={(v) =>
            setQuantite(typeof v === "number" ? v : parseFloat(v))
          }
          disabled={!isEditing}
           mt="sm"
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
          opened={modalFor !== null}
          onClose={handleCloseModal}
          title="Connexion"
          centered
        >
          <TextInput
            label="Matricule"
            placeholder="0000"
            value={matricule}
            onChange={(d) => setMatricule(d.currentTarget.value)}
            mb="sm"
          />
          <PasswordInput
            label="Mot de passe"
            placeholder="Mot de passe"
            value={password}
            onChange={(d) => setPassword(d.currentTarget.value)}
            mb="sm"
          />
          <Group>
            <Button variant="default" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button onClick={handleLogin} color="blue">
              Se connecter
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
