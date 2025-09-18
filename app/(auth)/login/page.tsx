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
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { useState } from "react";

export default function LoginPage(Props: PaperProps) {
  const [type, toggle] = useToggle(["Se connecter", "Créer un compte"]);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const form = useForm({
    initialValues: {
      identification: "",
      password: "",
      name: "",
    },
    validate: {
      identification: (val) => (val.length > 0 ? null : "Matri obligatoire"),
      password: (val) =>
        val.length < 6
          ? "Le Mot de passe doit contenir au moins 6 caractères"
          : null,
      name: (val) =>
        type === "créer un compte" && val.length < 3 ? "Nom obligatoire" : null,
    },
  });
  const handleSubmit = (values: typeof form.values) => {
    if (type === "Créer un compte" && !isTermsAccepted) {
      alert(
        "Vous devez accepter les termes et conditions pour créer un compte"
      );
    }
    if (type === "Se connecter") {
      alert("connexion réussie");
      window.location.href = "/dashboard";
    } else {
      alert("Compte créé avec succès");
      toggle();
    }
  };
  return (
    <Center h="100vh">
      <Paper radius="md" p="lg" withBorder w={550}>
        <Title order={2} mb="md" ta="center">
          Connexion
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === "Créer un compte" && (
              <TextInput
                label="Nom"
                placeholder="Votre nom"
                {...form.getInputProps("name")}
                radius="md"
              />
            )}
            <TextInput
            required
              label="Matricule"
              placeholder="Votre numero d'identification"
              {...form.getInputProps("identification")}
              radius="md"
            />

            <PasswordInput
              label="Mot de passe"
              placeholder="Votre mot de passe"
              {...form.getInputProps("password")}
              radius="md"
            />

            {type === "Créer un compte" && (
              <Checkbox
                color="#c94b06"
                label="J'accepte les termes et les conditions d'utilisation"
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
                    "&:not(:checked)": {
                      borderColor: "#c94b06",
                    },
                  },
                }}
              />
            )}
          </Stack>
          <Group justify="space-between" mt="lx">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
            >
              {type === "Créer un compte"
                ? "Vous avez déja un compte? Se connecter"
                : "Vous n'avez pas de compte? Créer un compte"}
            </Anchor>

            <Button
              color="#c94b06"
              type="submit"
              radius="xl"
              mt="md"
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
