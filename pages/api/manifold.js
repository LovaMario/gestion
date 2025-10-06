import { db } from "../../lib/db";


export default async function handler(req, res) {
  try {
    // GET: récupérer tous les manifolds
    if (req.method === "GET") {
      const [rows] = await db.query("SELECT * FROM manifold");
      return res.status(200).json(rows);
    }

    // POST: créer un nouveau manifold
    if (req.method === "POST") {
      const {
        Demandeur,
        recepteur,
        code1,
        code2,
        code3,
        NomArticle,
        finCompteur,
        DPU,
        dateCommande,
        quantite,
        imputation,
        check1,
        check2,
        check3,
        checkerNames,
      } = req.body;

      const [result] = await db.query(
        `INSERT INTO manifold 
          (Demandeur, recepteur, code1, code2, code3, NomArticle, finCompteur, DPU, dateCommande, quantite, imputation, check1, check2, check3, checker1_nom, checker2_nom, checker3_nom)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Demandeur,
          recepteur,
          code1,
          code2,
          code3,
          NomArticle,
          finCompteur,
          DPU,
          dateCommande,
          quantite,
          imputation,
          check1 ? 1 : 0,
          check2 ? 1 : 0,
          check3 ? 1 : 0,
          checkerNames?.[1] || null,
          checkerNames?.[2] || null,
          checkerNames?.[3] || null,
        ]
      );

      const manifold = {
        id: result.insertId,
        Demandeur,
        recepteur,
        code1,
        code2,
        code3,
        NomArticle,
        finCompteur,
        DPU,
        dateCommande,
        quantite,
        imputation,
        check1,
        check2,
        check3,
        checkerNames: {
          1: checkerNames?.[1] || "",
          2: checkerNames?.[2] || "",
          3: checkerNames?.[3] || "",
        },
        checker1_nom: checkerNames?.[1] || null,
        checker2_nom: checkerNames?.[2] || null,
        checker3_nom: checkerNames?.[3] || null,
      };

      return res.status(201).json({ message: "Manifold créé avec succès", manifold });
    }

    // PUT: mettre à jour un manifold existant
    if (req.method === "PUT") {
      const {
        id,
        Demandeur,
        recepteur,
        code1,
        code2,
        code3,
        NomArticle,
        finCompteur,
        DPU,
        dateCommande,
        quantite,
        imputation,
        check1,
        check2,
        check3,
        checker1_nom,
        checker2_nom,
        checker3_nom,
        checkerNames,
      } = req.body;

      await db.query(
        `UPDATE manifold SET
          Demandeur = ?, recepteur = ?, code1 = ?, code2 = ?, code3 = ?, NomArticle = ?,
          finCompteur = ?, DPU = ?, dateCommande = ?, quantite = ?, 
          imputation = ?, 
          check1 = ?, check2 = ?, check3 = ?, 
          checker1_nom = ?, checker2_nom = ?, checker3_nom = ?
         WHERE id = ?`,
        [
          Demandeur,
          recepteur,
          code1,
          code2,
          code3,
          NomArticle,
          finCompteur,
          DPU,
          dateCommande,
          quantite,
          imputation,
          check1 ? 1 : 0,
          check2 ? 1 : 0,
          check3 ? 1 : 0,
          checker1_nom || null,
          checker2_nom || null,
          checker3_nom || null,
          id,
        ]
      );

      const updatedManifold = {
        ...req.body,
        checkerNames: {
          1: checkerNames?.[1] || "",
          2: checkerNames?.[2] || "",
          3: checkerNames?.[3] || "",
        },
        checker1_nom: checkerNames?.[1] || null,
        checker2_nom: checkerNames?.[2] || null,
        checker3_nom: checkerNames?.[3] || null,
      };

      return res.status(200).json({
        message: "Manifold mis à jour avec succès",
        manifold: updatedManifold,
      });
    }

    // Méthode non autorisée
    return res.status(405).json({ message: "Méthode non autorisée" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur : " + error.message });
  }
}
