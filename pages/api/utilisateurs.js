import { db } from "../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // Recherche utilisateur par matricule (GET)
  if (req.method === "GET") {
    const { matricule } = req.query;

    if (!matricule) return res.status(400).json({ message: "Matricule non fourni" });

    try {
      const [rows] = await db.query(
        "SELECT * FROM utilisateurs WHERE LOWER(matricule) = LOWER(?)",
        [matricule.trim()]
      );

      if (!rows || rows.length === 0)
        return res.status(404).json({ message: "Utilisateur non trouvé" });

      return res.status(200).json({ name: rows[0].nom });
    } catch (error) {
      console.error("Erreur GET:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  // Création/utilisateur ou connexion
  if (req.method === "POST") {
    const {
      piece, manuelle, magasin, depot, dateSortie, departement,
      atelier, secteur, codeArticle, libelleArticle, quantite,
      imputation, imputationCode, commande, unite,
      check1, check2, check3, locked1, locked2, locked3,
      matricule, name, password, type
    } = req.body;

    // Création de compte utilisateur
    if (type === "Créer un compte") {
      if (!matricule || !name || !password)
        return res.status(400).json({ message: "Champs manquants" });

      try {
        const [existing] = await db.query(
          "SELECT * FROM utilisateurs WHERE LOWER(matricule) = LOWER(?)",
          [matricule.trim()]
        );

        if (existing.length > 0)
          return res.status(400).json({ message: "Matricule déjà utilisé" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
          "INSERT INTO utilisateurs (nom, matricule, mot_de_passe) VALUES (?, ?, ?)",
          [name, matricule.trim(), hashedPassword]
        );

        return res.status(201).json({ message: "Compte créé avec succès" });
      } catch (error) {
        console.error("Erreur création compte:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la création du compte" });
      }
    }

    // Connexion utilisateur
    if (type === "Se Connecter") {
      if (!matricule || !password)
        return res.status(400).json({ message: "Matricule et mot de passe requis" });

      try {
        const [users] = await db.query(
          "SELECT * FROM utilisateurs WHERE LOWER(matricule) = LOWER(?)",
          [matricule.trim()]
        );

        if (!users || users.length === 0)
          return res.status(401).json({ message: "Matricule ou mot de passe incorrect" });

        const valid = await bcrypt.compare(password, users[0].mot_de_passe);
        if (!valid)
          return res.status(401).json({ message: "Matricule ou mot de passe incorrect" });

        return res.status(200).json({
          message: "Connexion réussie",
          user: { id: users[0].id, nom: users[0].nom },
        });
      } catch (error) {
        console.error("Erreur connexion:", error);
        return res.status(500).json({ message: "Erreur serveur lors de la connexion" });
      }
    }

    return res.status(400).json({ message: "Requête non reconnue" });
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}
