import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { matricule, password } = req.body;

  if (!matricule || !password) {
    return res.status(400).json({ message: "Matricule et mot de passe requis" });
  }

  try {
    const [rows]: any = await db.query("SELECT * FROM magasinier WHERE matricule = ?", [matricule]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    return res.status(200).json({ message: "Connexion réussie", user: { id: user.id, nom: user.nom } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
