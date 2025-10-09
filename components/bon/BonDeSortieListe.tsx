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
  loading: boolean;
};

export default function BonDeSortieListe({
  setSelectedBonDeSortie,
  setIsEditing,
  bonsDeSortie,
  loading,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBons = bonsDeSortie.filter((b) =>{
    const term = searchTerm.toLowerCase();
    return (
      (b.codeArticle?.toLowerCase().includes(term)) ||
      (b.id !== undefined && b.id !== null && b.id.toString().toLowerCase().includes(term))
    );
  });

  if (loading) {
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

  return (
    <Card shadow="sm" radius="md" p="md" m={10}>
      <Title order={3} mb="md">
        Liste de Bons de Sortie
      </Title>

      <TextInput
        placeholder="Rechercher par code article, ou numéro du BSM..."
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
                  N° BSM
                </th>
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
              {filteredBons.map((bon, index) => (
                <tr
                  // 🎯 CORRECTION: Utilise bon.id s'il est valide (> 0), sinon utilise
                  // une clé composite temporaire (ID de la pièce + index de la liste)
                  key={bon.id && bon.id > 0 ? bon.id : `temp-${bon.piece}-${index}`}
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
                    {bon.id}
                  </td>
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