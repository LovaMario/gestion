'use client'

import { Button, Center, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <Center style={{ height: "100vh" }}>
      <Stack align="center">
        
        <Title order={1}>Bienvenue</Title>
        <Text size="lg">Gestion de stock</Text>
        <Link href="/login">
          <Button variant="filled" color="#404140" size="md">
            Veuillez vous connecter
          </Button>
        </Link>
      </Stack>
    </Center>
  );
}
