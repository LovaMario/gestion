// BonDeSortieListe.tsx (CODE CORRIGÉ)
"use client";

import React, { useState } from "react";
import {
  Card,
  Table,
  Title,
  TextInput,
  Text,
  ActionIcon,
  Group,
  ScrollArea,
  Tooltip,
  Loader,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { BonDeSortie } from "./BonDeSortie";

type Props = {
  setSelectedBonDeSortie: React.Dispatch<
    React.SetStateAction<BonDeSortie | null>
  >;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  bonsDeSortie: BonDeSortie[];
  setBonsDeSortie: React.Dispatch<React.SetStateAction<BonDeSortie[]>>;
  loading: boolean; // 🎯 AJOUTÉ : L'état de chargement vient du parent
};

export default function BonDeSortieListe({
  setSelectedBonDeSortie,
  setIsEditing,
  bonsDeSortie,
  loading, // Récupération de l'état de chargement du parent
}: Props & { loading: boolean }) {
  // Ajout de 'loading' pour le type check

  const [searchTerm, setSearchTerm] = useState("");

  // ❌ L'useEffect pour le fetch a été supprimé ! C'est le rôle du composant parent.

  const filteredBons = bonsDeSortie.filter((b) =>
    b.codeArticle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    // Affiche le loader si le parent indique qu'il charge
    return (
      <Card shadow="xl" radius="lg" p="md" m={10}>
        <Group justify="center">
          <Loader color="orange" />
          <Text>Chargement des bons de sortie...</Text>
        </Group>
      </Card>
    );
  }

  if (bonsDeSortie.length === 0) {
    return (
      <Card shadow="sm" radius="md" p="md" m={10}>
        <Text>Aucune demande de Bon de Sortie enregistrée</Text>
      </Card>
    );
  }

  // ... (Reste du rendu inchangé) ...
  return (
    <Card shadow="sm" radius="md" p="md" m={10}>
      <Title order={3} mb="md">
        Liste de Bons de Sortie
      </Title>

      <TextInput
        placeholder="Rechercher par code article..."
        mb="md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />

      {filteredBons.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Aucun bon trouvé
        </Text>
      ) : (
        <ScrollArea h={650}>
          <Table>
            <thead>
              <tr>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Code article
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  N° Pièce
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  N° pièce manuelle
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Quantité
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBons.map((bon) => (
                <tr
                  key={bon.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedBonDeSortie(bon);
                    setIsEditing(false);
                  }}
                >
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {bon.codeArticle}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {bon.piece}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {bon.manuelle}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {bon.quantite}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    <Group gap="xs" justify="center">
                      <Tooltip label="Modifier" withArrow>
                        <ActionIcon
                          color="green"
                          variant="light"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBonDeSortie(bon);
                            setIsEditing(true);
                          }}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      )}
    </Card>
  );
}
