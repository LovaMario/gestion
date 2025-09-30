"use client";
import React, { useState } from "react";
import { Manifold } from "./manifold";
import {
  ActionIcon,
  Card,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";

type Props = {
  Manifold: Manifold[];
  setManifold: React.Dispatch<React.SetStateAction<Manifold[]>>;
  setSelectedManifold: (bon: Manifold) => void;
  setIsEditing: (value: boolean) => void;
};

export default function ManifoldListe({
  Manifold,
  setSelectedManifold,
  setIsEditing,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtredManifold = (Manifold ?? []).filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.code1.toLowerCase().includes(term) ||
      m.code2.toLowerCase().includes(term) ||
      m.code3.toLowerCase().includes(term)
    );
  });

  if (!Manifold || Manifold.length === 0) {
    return (
      <Card shadow="sm" radius="md" p="md" m={10}>
        <Text>Aucune commande enregistrée</Text>
      </Card>
    );
  }
  return (
    <Card shadow="xl" radius="lg" p="md" m={10}>
      <Title order={3} mb="md">
        Liste des commandes
      </Title>

      <TextInput
        placeholder="Rechercher par code."
        mb="md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />

      {filtredManifold.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Aucune BSM trouvée
        </Text>
      ) : (
        <ScrollArea h={650}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Demandeur
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Récepteur
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Code 1
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Code 2
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Code 3
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Quantité
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Article
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Date
                </th>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Action
                </th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtredManifold.map((Manifold) => (
                <tr
                  key={Manifold.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedManifold(Manifold);
                    setIsEditing(false);
                  }}
                >
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {Manifold.Demandeur}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {Manifold.recepteur}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {Manifold.code1}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {Manifold.code2}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {Manifold.code3}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {Manifold.quantite}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {Manifold.NomArticle}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "1px solid #a59a9aff",
                    }}
                  >
                    {Manifold.dateCommande}
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
                            setSelectedManifold(Manifold);
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
