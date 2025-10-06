import { db } from "../../lib/db";

export default async function handler(req, res) {
  try {
    // 🔹 Récupérer tous les bons de sortie
    if (req.method === "GET") {
      const [rows] = await db.query("SELECT * FROM bon_de_sortie");
      return res.status(200).json(rows);
    }

    // 🔹 Créer un nouveau bon de sortie
    if (req.method === "POST") {
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
        checkerNames, // objet {1: nom, 2: nom, 3: nom}
      } = req.body;

      const [result] = await db.query(
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
          check1 ? 1 : 0,
          check2 ? 1 : 0,
          check3 ? 1 : 0,
          checkerNames?.[1] || null,
          checkerNames?.[2] || null,
          checkerNames?.[3] || null,
        ]
      );

      // renvoyer l'objet créé avec l'id
      const bonDeSortie = {
        id: result.insertId,
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
        checkerNames: {
          1: checkerNames?.[1] || "",
          2: checkerNames?.[2] || "",
          3: checkerNames?.[3] || "",
        },
        checker1_nom: checkerNames?.[1] || null, // Ajout des champs bruts
        checker2_nom: checkerNames?.[2] || null,
        checker3_nom: checkerNames?.[3] || null,
      };

      return res
        .status(201)
        .json({ message: "Bon créé avec succès", bonDeSortie });
    }

    // 🔹 Mettre à jour un bon de sortie existant
    if (req.method === "PUT") {
      const {
        id,
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
        locked1, // 💡 AJOUTÉ pour la DB
        locked2, // 💡 AJOUTÉ pour la DB
        locked3, // 💡 AJOUTÉ pour la DB
        checker1_nom, // 💡 AJOUTÉ pour la DB (si envoyé directement)
        checker2_nom, // 💡 AJOUTÉ pour la DB
        checker3_nom, // 💡 AJOUTÉ pour la DB
        checkerNames,
      } = req.body;

      await db.query(
        `UPDATE bon_de_sortie SET
          piece = ?, manuelle = ?, magasin = ?, depot = ?, dateSortie = ?, departement = ?,
          atelier = ?, secteur = ?, codeArticle = ?, libelleArticle = ?, quantite = ?, 
          imputation = ?, imputationCode = ?, commande = ?, unite = ?, 
          check1 = ?, check2 = ?, check3 = ?, 
          checker1_nom = ?, checker2_nom = ?, checker3_nom = ?
         WHERE id = ?`,
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
          check1 ? 1 : 0,
          check2 ? 1 : 0,
          check3 ? 1 : 0,
          locked1 ? 1 : 0, // 💡 AJOUTÉ
          locked2 ? 1 : 0, // 💡 AJOUTÉ
          locked3 ? 1 : 0, // 💡 AJOUTÉ
          checker1_nom || null, // 💡 Utilise maintenant la valeur brute ou null
          checker2_nom || null,
          checker3_nom || null,
          id,
        ]
      );
      const updatedBonDeSortie = {
        ...req.body, // On prend tous les champs
        // On écrase l'objet temporaire 'checkerNames' et on ajoute les champs bruts
        checkerNames: {
          1: req.body.checkerNames?.[1] || "",
          2: req.body.checkerNames?.[2] || "",
          3: req.body.checkerNames?.[3] || "",
        },
        checker1_nom: checkerNames?.[1] || null,
        checker2_nom: checkerNames?.[2] || null,
        checker3_nom: checkerNames?.[3] || null,
      };

      return res.status(200).json({
        message: "Bon mis à jour avec succès",
        bonDeSortie: updatedBonDeSortie,
      });
    }

    // 🔹 Méthode non autorisée
    return res.status(405).json({ message: "Méthode non autorisée" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
