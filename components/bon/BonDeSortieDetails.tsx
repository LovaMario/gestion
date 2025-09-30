"use client";

import React, { useEffect, useRef, useState } from "react";
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
  BonsDeSortie: BonDeSortie[];
  setBonsDeSortie: React.Dispatch<React.SetStateAction<BonDeSortie[]>>;
  selectedBonDeSortie: BonDeSortie | null;
  setSelectedBonDeSortie: React.Dispatch<
    React.SetStateAction<BonDeSortie | null>
  >;
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
  // NOTE: si tu veux l'auto-lookup, utilise `matricule` local (défini plus bas) ou form.values.*.
  // Ici je le laisse désactivé pour éviter des fetchs incohérents pendant l'édition.
  useEffect(
    () => {
      // example placeholder if you want to enable lookup:
      // if (!form.values.matricule || type === "Créer un compte") return;
      // ...call API avec form.values.matricule...
    },
    [
      /* form.values.matricule, type - active si voulu */
    ]
  );

  // Modal
  const [opened, setOpened] = useState(false);
  const [activeCheckbox, setActiveCheckbox] = useState<number | null>(null);
  const [matricule, setMatricule] = useState("");
  const [password, setPassword] = useState("");

  // pour gérer reset seulement quand on entre en edition
  const prevIsEditingRef = useRef<boolean>(isEditing);

  const handleCheckboxClick = (index: number) => {
    // sécurité : plus rien si non éditable
    if (!isEditing) return;

    // Bloquer si déjà confirmé
    if (
      (index === 1 && locked1) ||
      (index === 2 && locked2) ||
      (index === 3 && locked3)
    ) {
      // debug possible : console.log("checkbox blocked", index);
      return;
    }

    setActiveCheckbox(index);
    setOpened(true);
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
        alert(data.message || "Authentification échouée");
        return;
      }

      // Mise à jour safe : on met le nom et on lock la checkbox correspondante
      setCheckerNames((prev) => ({
        ...prev,
        [activeCheckbox!]: data.user?.nom ?? data.name ?? "Utilisateur",
      }));

      // Verrouillage et check via updates distincts
      if (activeCheckbox === 1) {
        setLocked1(true);
        setCheck1(true);
      } else if (activeCheckbox === 2) {
        setLocked2(true);
        setCheck2(true);
      } else if (activeCheckbox === 3) {
        setLocked3(true);
        setCheck3(true);
      }

      // fermer modal et nettoyer
      setOpened(false);
      setActiveCheckbox(null);
      setMatricule("");
      setPassword("");

      alert(`Confirmé par ${data.user?.nom ?? data.name ?? "Utilisateur"}`);
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

  const bonData: BonDeSortie = {
    id: selectedBonDeSortie?.id ?? 0,
    piece: piece ?? 0, // <-- ici on remplace undefined par 0
    manuelle: manuelle ?? 0, // <-- idem
    magasin: magasinValue || "",
    depot: depotValue || "",
    dateSortie: dateSortie || "",
    departement: departementValue || "",
    atelier: atelierValue || "",
    secteur: secteurValue || "",
    codeArticle: codeArticle || "",
    libelleArticle: libelleArticle || "",
    quantite: quantite ?? 0, // idem pour quantite
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

  useEffect(() => {
    // Si on charge un bon existant -> restaurer tout (y compris locks)
    if (selectedBonDeSortie) {
      setPiece(selectedBonDeSortie.piece ?? undefined);
      setManuelle(selectedBonDeSortie.manuelle);
      setMagasinValue(selectedBonDeSortie?.magasin ?? "");
      setDateSortie(selectedBonDeSortie?.dateSortie ?? "");
      setDepartementValue(selectedBonDeSortie?.departement ?? "");
      setAtelierValue(selectedBonDeSortie?.atelier ?? "");
      setDepotValue(selectedBonDeSortie?.depot ?? "");
      setSecteurValue(selectedBonDeSortie?.secteur ?? "");
      setCodeArticle(selectedBonDeSortie.codeArticle ?? "");
      setLibelleArticle(selectedBonDeSortie.libelleArticle ?? "");
      setQuantite(selectedBonDeSortie.quantite ?? undefined);
      setImputation(selectedBonDeSortie.imputation ?? "");
      setImputationCode(selectedBonDeSortie.imputationCode ?? "");
      setCommande(selectedBonDeSortie.commande ?? "");
      setUnite(selectedBonDeSortie.unite ?? "");

      // Restaurer cases et locks depuis l'objet
      setCheck1(selectedBonDeSortie.check1 ?? false);
      setCheck2(selectedBonDeSortie.check2 ?? false);
      setCheck3(selectedBonDeSortie.check3 ?? false);
      setLocked1(selectedBonDeSortie.locked1 ?? false);
      setLocked2(selectedBonDeSortie.locked2 ?? false);
      setLocked3(selectedBonDeSortie.locked3 ?? false);
      setCheckerNames(selectedBonDeSortie.checkerNames ?? {});
      prevIsEditingRef.current = isEditing;
      return;
    }

    // Si on vient d'entrer en mode édition (false -> true), on reset le formulaire
    if (isEditing && !prevIsEditingRef.current) {
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

      // reset des checks/locks pour un nouveau bon
      setCheck1(false);
      setCheck2(false);
      setCheck3(false);
      setLocked1(false);
      setLocked2(false);
      setLocked3(false);
      setCheckerNames({});
    }

    prevIsEditingRef.current = isEditing;
  }, [selectedBonDeSortie, isEditing]);

  const [modalFor, setModalFor] = useState<number | null>(null);

  const handleCloseModal = () => {
    // fermer et nettoyer activeCheckbox aussi
    setOpened(false);
    setActiveCheckbox(null);
    setModalFor(null);
    setMatricule("");
    setPassword("");
  };

  const handleSave = async () => {
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
      // POST pour créer un nouveau bon
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

      // ✅ mettre à jour l'état correctement
      setBonsDeSortie((prev) => [...prev, result.bonDeSortie]);

      setSubmitted(true);
      alert("Bon de sortie enregistré avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    }
  };

  const handleUpdate = async (bon: BonDeSortie) => {
    try {
      const res = await fetch("/api/bonDeSortie", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bon),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Erreur lors de la mise à jour");
        return;
      }

      // 🔹 remplacer le bon existant dans l'état
      setBonsDeSortie((prev) =>
        prev.map((b) =>
          b.id === result.bonDeSortie.id ? result.bonDeSortie : b
        )
      );

      alert("Bon de sortie mis à jour avec succès !");
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

        <Group>
          <Checkbox
            label={
              <>
                Magasinier{" "}
                
              </>
            }
            checked={check1}
            onChange={(e) => {
              if (locked1 || !isEditing) {
                e.preventDefault();
                return;
              }
              handleCheckboxClick(1);
            }}
            disabled={!isEditing || locked1}
            mt="sm"
          />

          <TextInput
            value={checkerNames[1] ?? ""}
            placeholder="Non confirmé"
            readOnly
            style={{ flex: 1 }}
          />
        </Group>

        <Checkbox
          label={
            <>
              Directeur{" "}
              {checkerNames[2] && (
                <Text span c="black" ml={5}>
                  {checkerNames[2]}
                </Text>
              )}
              {locked2 && (
                <Text span ml={6}>
                  🔒
                </Text>
              )}
            </>
          }
          checked={check2}
          onChange={(e) => {
            if (locked2 || !isEditing) {
              e.preventDefault();
              return;
            }
            handleCheckboxClick(2);
          }}
          disabled={!isEditing || locked2}
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
              {locked3 && (
                <Text span ml={6}>
                  🔒
                </Text>
              )}
            </>
          }
          checked={check3}
          onChange={(e) => {
            if (locked3 || !isEditing) {
              e.preventDefault();
              return;
            }
            handleCheckboxClick(3);
          }}
          disabled={!isEditing || locked3}
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
            <Button
              color="#c94B06"
              onClick={() => {
                const bonData = {
                  piece,
                  manuelle,
                  magasin: magasinValue || "",
                  depot: depotValue || "",
                  dateSortie,
                  departement: departementValue || "",
                  atelier: atelierValue || "",
                  secteur: secteurValue || "",
                  codeArticle,
                  libelleArticle,
                  quantite: quantite || 0,
                  imputation,
                  imputationCode,
                  commande,
                  unite,
                  check1,
                  check2,
                  check3,
                  locked1,
                  locked2,
                  locked3,
                  checkerNames,
                };

                if (selectedBonDeSortie) {
                  // On modifie un bon existant
                  handleUpdate({ ...bonData, id: selectedBonDeSortie.id });
                } else {
                  // On crée un nouveau bon
                  handleSave();
                }
              }}
              mt="sm"
            >
              Enregistrer
            </Button>
          </Group>
        )}
      </Card>
    </ScrollArea>
  );
}
