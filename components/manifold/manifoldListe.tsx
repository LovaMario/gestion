"use client";
import React, { useState } from "react";
import { Manifold } from "./manifold";
import {
  ActionIcon,
  Card,
  Group,
  Loader,
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
  setSelectedManifold: (manifold: Manifold) => void;
  setIsEditing: (value: boolean) => void;
  loading: boolean;
};

export default function ManifoldListe({
  Manifold,
  setSelectedManifold,
  setIsEditing,
  loading,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtredManifold = Manifold.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.id !== undefined &&
      b.id !== null &&
      b.id.toString().toLowerCase().includes(term)

    );
  });

  if (loading) {
    return (
      <Card shadow="sm" radius="md" p="md" m={10}>
        <Group justify="center">
          <Loader color="orange" />
          <Text>Chargement des Manifold...</Text>
        </Group>
      </Card>
    );
  }

  if (Manifold.length === 0) {
    return (
      <Card shadow="sm" radius="md" p="md" m={10}>
        <Text>Aucune Manifold enregistrée</Text>
      </Card>
    );
  }
  return (
    <Card shadow="xl" radius="lg" p="md" m={10}>
      <Title order={3} mb="md">
        Liste des Manifold
      </Title>

      <TextInput
        placeholder="Numero manifold"
        mb="md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />

      {filtredManifold.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Aucune Manifold trouvée
        </Text>
      ) : (
        <ScrollArea h={650}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <th
                  style={{ textAlign: "center", border: "1px solid #a59a9aff" }}
                >
                  Numéro manifold
                </th>
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
                  Action
                </th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtredManifold.map((Manifold, idx) => (
                <tr
                  key={Manifold.id ?? `manifold-row-${idx}`}
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
                    {Manifold.id}
                  </td>
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
