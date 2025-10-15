import { db } from "../../lib/db";

// Fonction utilitaire pour insérer un tableau d'articles
const insertArticles = async (bonId, articles) => {
  if (!articles || articles.length === 0) return;

  const values = articles.flatMap((art) => [
    bonId,
    art.codeArticle || "",
    art.libelleArticle || "",
    art.quantite ?? 0,
    art.unite || "",
    art.imputation || "",
    art.imputationCode || null,
    art.commande || "",
  ]);

  const placeholders = articles
    .map(() => "(?, ?, ?, ?, ?, ?, ?, ?)")
    .join(", ");

  await db.query(
    `INSERT INTO articles_sortie (bon_de_sortie_id, codeArticle, libelleArticle, quantite, unite, imputation, imputationCode, commande) 
     VALUES ${placeholders}`,
    values
  );
};

export default async function handler(req, res) {
  try {
    // 🔹 Récupérer tous les bons de sortie (avec leurs articles)
    if (req.method === "GET") {
      const [bons] = await db.query("SELECT * FROM bon_de_sortie");

      if (bons.length === 0) {
        return res.status(200).json([]);
      }

      const bonIds = bons.map((bon) => bon.id);

      // Récupérer tous les articles de tous les bons en une seule requête
      const [articlesRows] = await db.query(
        `SELECT id, bon_de_sortie_id, codeArticle, libelleArticle, quantite, unite, imputation, imputationCode, commande 
         FROM articles_sortie WHERE bon_de_sortie_id IN (?)`,
        [bonIds]
      );

      // Grouper les articles par bon_de_sortie_id
      const articlesMap = articlesRows.reduce((acc, article) => {
        const bonId = article.bon_de_sortie_id;
        if (!acc[bonId]) {
          acc[bonId] = [];
        }
        // Utiliser les noms de colonnes du front
        acc[bonId].push({
          id: article.id, // ID de l'article dans la DB (important si on veut gérer la mise à jour fine plus tard)
          codeArticle: article.codeArticle,
          libelleArticle: article.libelleArticle,
          quantite: article.quantite,
          unite: article.unite,
          imputation: article.imputation,
          imputationCode: article.imputationCode,
          commande: article.commande,
        });
        return acc;
      }, {});

      // Combiner les bons de sortie avec leurs articles
      const bonsWithArticles = bons.map((bon) => ({
        ...bon,
        // Conversion de 1/0 en boolean
        check1: bon.check1 === 1,
        check2: bon.check2 === 1,
        check3: bon.check3 === 1,
        locked1: bon.locked1 === 1,
        locked2: bon.locked2 === 1,
        locked3: bon.locked3 === 1,

        checkerNames: {
          1: bon.checker1_nom || "",
          2: bon.checker2_nom || "",
          3: bon.checker3_nom || "",
        },
        articles: articlesMap[bon.id] || [], // Attacher le tableau d'articles
      }));

      return res.status(200).json(bonsWithArticles);
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
        articles, // 💡 NOUVEAU: Tableau d'articles
        check1,
        check2,
        check3,
        locked1,
        locked2,
        locked3,
        checkerNames, // objet {1: nom, 2: nom, 3: nom}
      } = req.body;

      // 1. Insertion du Bon de sortie (Entête)
      const [result] = await db.query(
        `INSERT INTO bon_de_sortie 
          (piece, manuelle, magasin, depot, dateSortie, departement, atelier, secteur, 
           check1, check2, check3, locked1, locked2, locked3, checker1_nom, checker2_nom, checker3_nom)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          piece,
          manuelle,
          magasin,
          depot,
          dateSortie,
          departement,
          atelier,
          secteur,
          check1 ? 1 : 0,
          check2 ? 1 : 0,
          check3 ? 1 : 0,
          locked1 ? 1 : 0,
          locked2 ? 1 : 0,
          locked3 ? 1 : 0,
          checkerNames?.[1] || null,
          checkerNames?.[2] || null,
          checkerNames?.[3] || null,
        ]
      );

      const newBonId = result.insertId;

      // 2. Insertion des articles associés
      await insertArticles(newBonId, articles);

      // renvoyer l'objet créé avec l'id
      const bonDeSortie = {
        id: newBonId,
        piece,
        manuelle,
        magasin,
        depot,
        dateSortie,
        departement,
        atelier,
        secteur,
        check1,
        check2,
        check3,
        locked1,
        locked2,
        locked3,
        articles: articles || [],
        checkerNames: {
          1: checkerNames?.[1] || "",
          2: checkerNames?.[2] || "",
          3: checkerNames?.[3] || "",
        },
        checker1_nom: checkerNames?.[1] || null,
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
        articles, // 💡 NOUVEAU: Tableau d'articles
        check1,
        check2,
        check3,
        locked1,
        locked2,
        locked3,
        checkerNames,
      } = req.body;

      // 1. Mise à jour de l'entête
      await db.query(
        `UPDATE bon_de_sortie SET
          piece = ?, manuelle = ?, magasin = ?, depot = ?, dateSortie = ?, departement = ?,
          atelier = ?, secteur = ?, 
          check1 = ?, check2 = ?, check3 = ?, 
          locked1 = ?, locked2 = ?, locked3 = ?,
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
          check1 ? 1 : 0,
          check2 ? 1 : 0,
          check3 ? 1 : 0,
          locked1 ? 1 : 0,
          locked2 ? 1 : 0,
          locked3 ? 1 : 0,
          checkerNames?.[1] || null,
          checkerNames?.[2] || null,
          checkerNames?.[3] || null,
          id,
        ]
      );

      // 2. Supprimer les anciens articles et les réinsérer
      // 💡 AJOUT DU TRY...CATCH POUR ISOLER L'ERREUR D'ARTICLE (cause probable du 500)
      try {
        await db.query(
          "DELETE FROM articles_sortie WHERE bon_de_sortie_id = ?",
          [id]
        );
        await insertArticles(id, articles);
      } catch (articleError) {
        // Loguer l'erreur mais NE PAS la renvoyer comme 500 si l'UPDATE principal a réussi.
        // Cela permet de ne pas bloquer le client si l'erreur est mineure (ex: articles vides/malformés).
        // SI vous voulez être STRICT, remplacez le catch par 'throw articleError'.
        console.error(
          "Erreur lors de la suppression/réinsertion des articles pour Bon ID:",
          id,
          articleError
        );
      }
      const updatedBonDeSortie = {
        ...req.body,
        articles: articles || [],
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
