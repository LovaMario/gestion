"use client";

import { Button, Center, Stack, Text, Title, Paper } from "@mantine/core";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <Center
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
        padding: "1rem",
      }}
    >
      <Paper
        p="xl"
        radius="lg"
        shadow="xl"
        withBorder
        style={{ textAlign: "center", backgroundColor: "white" }}
      >
        <Stack align="center" >
          <img src="logo.png" width={100} height={60}/>
          {/* Logo ou titre principal */}
          <Title order={1} c="#c94b06">
            Bienvenue
          </Title>

          <Text size="lg" c="dimmed">
            Gestion de stock
          </Text>

          {/* Bouton vers la page de connexion */}
          <Link href="/login">
            <Button
              variant="filled"
              color="#c94b06"
              size="md"
              radius="xl"
              style={{ marginTop: "1rem" }}
            >
              Veuillez vous connecter
            </Button>
          </Link>
        </Stack>
      </Paper>
    </Center>
  );
}
