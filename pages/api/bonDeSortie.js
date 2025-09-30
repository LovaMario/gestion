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
        checkerNames // <-- bien récupérer depuis le front
      } = req.body;

      await db.query(
        `INSERT INTO bon_de_sortie
        (piece, manuelle, magasin, depot, dateSortie, departement, atelier, secteur, codeArticle, libelleArticle, quantite, imputation, imputationCode, commande, unite, check1, check2, check3, checker1_nom, checker2_nom, checker3_nom)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          checkerNames?.[1] || null, // <-- utiliser optional chaining pour éviter undefined
          checkerNames?.[2] || null,
          checkerNames?.[3] || null
        ]
      );

      return res
        .status(201)
        .json({ message: "Bon de sortie enregistré avec succès" });
    } catch (error) {
      console.error("Erreur POST:", error);
      return res
        .status(500)
        .json({ message: "Erreur serveur lors de l’enregistrement" });
    }
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}
