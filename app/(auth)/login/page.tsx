"use client";

import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { useState, useEffect } from "react";

export default function LoginPage(props: PaperProps) {
  const [type, toggle] = useToggle(["Se Connecter", "Créer un compte"]);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
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

  // Recherche auto du nom en mode login
  useEffect(() => {
    if (!form.values.matricule || type === "Créer un compte") {
      setUserName("");
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoadingName(true);
      try {
        const res = await fetch(
          `/api/utilisateurs?matricule=${form.values.matricule.trim()}`
        );
        const data = await res.json();
        setUserName(res.ok ? data.name : "Utilisateur non trouvé");
      } catch {
        setUserName("Erreur de connexion");
      } finally {
        setLoadingName(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form.values.matricule, type]);

  const handleSubmit = async (values: typeof form.values) => {
    if (type === "Créer un compte" && !isTermsAccepted) {
      alert("Vous devez accepter les termes et conditions.");
      return;
    }

    try {
      const res = await fetch("/api/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message);
      if (type === "Se Connecter") {
        if (data.name) {
          localStorage.setItem("userName", data.name);
        }
        window.location.href = "/dashboard";
      } else {
        toggle();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Center h="100%" mt={100}>
      <Paper
        radius="lg"
        p="xl"
        shadow="xl"
        withBorder
        w={450}
        style={{ backgroundColor: "white" }}
      >
        <Title order={2} mb="sm" ta="center" c="#c94b06">
          {type}
        </Title>
        <Text size="sm" ta="center" c="dimmed" mb="lg">
          {type === "Se Connecter"
            ? "Entrez vos identifiants pour accéder au tableau de bord."
            : "Créez un compte pour rejoindre la plateforme."}
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === "Créer un compte" && (
              <TextInput
                label="Nom"
                placeholder="Votre nom"
                {...form.getInputProps("name")}
                radius="md"
                required
              />
            )}
            <TextInput
              label={
                <Group justify="left" gap={5}>
                  <Text>Matricule</Text>
                  {type === "Se Connecter" &&
                    form.values.matricule &&
                    (loadingName ? (
                      <Group gap={5}>
                        <Loader size="xs" />
                        <Text size="xs" c="dimmed">
                          Recherche du nom...
                        </Text>
                      </Group>
                    ) : (
                      <Text
                        size="md"
                        c={
                          userName === "Utilisateur non trouvé"
                            ? "red"
                            : userName === "Erreur de connexion"
                            ? "gray"
                            : "dimmed"
                        }
                        fw={500}
                      >
                        {userName}
                      </Text>
                    ))}
                </Group>
              }
              placeholder="Votre matricule"
              {...form.getInputProps("matricule")}
              radius="md"
            />

            <PasswordInput
              required
              label="Mot de passe"
              placeholder="Votre mot de passe"
              {...form.getInputProps("password")}
              radius="md"
            />

            {type === "Créer un compte" && (
              <Checkbox
                label="J'accepte les termes et conditions"
                checked={isTermsAccepted}
                onChange={(event) =>
                  setIsTermsAccepted(event.currentTarget.checked)
                }
                styles={{
                  label: { color: "#c94b06" },
                  input: {
                    "&:checked": {
                      backgroundColor: "#c94b06",
                      borderColor: "#c94b06",
                    },
                    "&:not(:checked)": { borderColor: "#c94b06" },
                  },
                }}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="lg">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="sm"
            >
              {type === "Créer un compte"
                ? "Déjà inscrit ? Se connecter"
                : "Pas encore de compte ? Créer un compte"}
            </Anchor>

            <Button
              color="#c94b06"
              type="submit"
              radius="xl"
              disabled={type === "Créer un compte" && !isTermsAccepted}
            >
              {type}
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}

