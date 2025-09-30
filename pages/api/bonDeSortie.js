import { db } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM bon_de_sortie");
      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        piece,
        manuelle,
        magasin,
        depot,
        dateSortie,
        departement,
        atelier,
        secteur,
        codeArticle,
        libelleArticle,
        quantite,
        imputation,
        imputationCode,
        commande,
        unite,
        check1,
        check2,
        check3,
        locked1,
        locked2,
        locked3,
      } = req.body;

      await db.query(
        `INSERT INTO bon_de_sortie
        (piece, manuelle, magasin, depot, dateSortie, departement, atelier, secteur, codeArticle, libelleArticle, quantite, imputation, imputationCode, commande, unite, check1, check2, check3)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          piece,
          manuelle,
          magasin,
          depot,
          dateSortie,
          departement,
          atelier,
          secteur,
          codeArticle,
          libelleArticle,
          quantite,
          imputation,
          imputationCode,
          commande,
          unite,
          check1,
          check2,
          check3,
        ]
      );

      return res.status(201).json({ message: "Bon de sortie enregistré avec succès" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur lors de l’enregistrement" });
    }
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}
