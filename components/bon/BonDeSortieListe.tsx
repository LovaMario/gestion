"use client";

import React, { useState, useEffect } from "react";
import { BonDeSortie } from "./BonDeSortie";
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

type Props = {
  bonsDeSortie: BonDeSortie[];
  setBonsDeSortie: React.Dispatch<React.SetStateAction<BonDeSortie[]>>;
  setSelectedBonDeSortie: React.Dispatch<React.SetStateAction<BonDeSortie | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function BonDeSortieListe({
  setSelectedBonDeSortie,
  setIsEditing,
}: Props) {
  const [bonsDeSortie, setBonsDeSortie] = useState<BonDeSortie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération depuis la base via API
  useEffect(() => {
    const fetchBons = async () => {
      try {
        const res = await fetch("/api/bonDeSortie");
        if (!res.ok) throw new Error("Erreur lors du fetch");
        const data = await res.json();
        setBonsDeSortie(data);
      } catch (err) {
        console.error("Erreur chargement BSM :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBons();
  }, []);

  const filteredBons = bonsDeSortie.filter((b) =>
    b.codeArticle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Table.Thead>
              <Table.Tr>
                <th style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                  Code article
                </th>
                <th style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                  N° Pièce
                </th>
                <th style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                  N° pièce manuelle
                </th>
                <th style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                  Quantité
                </th>
                <th style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                  Actions
                </th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredBons.map((bon) => (
                <tr
                  key={bon.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedBonDeSortie(bon);
                    setIsEditing(false);
                  }}
                >
                  <td style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                    {bon.codeArticle}
                  </td>
                  <td style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                    {bon.piece}
                  </td>
                  <td style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                    {bon.manuelle}
                  </td>
                  <td style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
                    {bon.quantite}
                  </td>
                  <td style={{ textAlign: "center", border: "1px solid #a59a9aff" }}>
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
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Card>
  );
}
