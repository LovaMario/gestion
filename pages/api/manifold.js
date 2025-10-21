import { db } from "../../lib/db";

/**
 * 🔧 Fonction utilitaire : insérer les articles d’un Manifold
 */
const insertArticles = async (manifoldId, articles) => {
  if (!articles || articles.length === 0) return;

  // Insert in chunks to avoid too many placeholders/parameters in one query
  const CHUNK_SIZE = 30; // safe default
  for (let i = 0; i < articles.length; i += CHUNK_SIZE) {
    const chunk = articles.slice(i, i + CHUNK_SIZE);
    const values = chunk.flatMap((art) => [
      manifoldId,
      art.NomArticle || "",
      art.quantite ?? 0,
      art.unite || "",
      art.finCompteur ?? "",
      art.DPU ?? 0,
      art.imputation ?? "",
    ]);

    const placeholders = chunk.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");

    try {
      console.log("INSERT ARTICLES chunk, manifoldId=", manifoldId, "count=", chunk.length);
      await db.query(
        `INSERT INTO articles_manifold 
          (manifold_id, NomArticle, Quantite, unite, finCompteur, DPU, imputation)
          VALUES ${placeholders}`,
        values
      );
    } catch (err) {
      console.error("Erreur insertArticles chunk manifoldId=", manifoldId, err);
      throw err;
    }
  }
};

/**
 * 🧠 Handler principal : gestion CRUD du Manifold de sortie
 */
export default async function handler(req, res) {
  try {
    /**
     * 📥 GET — récupérer tous les Manifolds avec leurs articles associés
     */
    if (req.method === "GET") {
      const [Manifolds] = await db.query("SELECT * FROM manifold");

      if (Manifolds.length === 0) {
        return res.status(200).json([]);
      }

      const ManifoldIds = Manifolds.map((b) => b.id);

      // Construire dynamiquement les placeholders pour la clause IN
      const manifoldPlaceholders = ManifoldIds.map(() => "?").join(",");
      const [articles] = await db.query(
        `SELECT id, manifold_id, NomArticle, Quantite, unite, finCompteur,
   DPU, imputation
   FROM articles_manifold 
   WHERE manifold_id IN (${manifoldPlaceholders})`,
        ManifoldIds
      );

      // Grouper les articles par manifold_id
      // Grouper les articles par manifold_id
      const articlesMap = articles.reduce((acc, article) => {
        const manifoldId = article.manifold_id;
        if (!acc[manifoldId]) {
          acc[manifoldId] = [];
        }

        acc[manifoldId].push({
          id: article.id,
          NomArticle: article.NomArticle,
          quantite: article.Quantite,
          unite: article.unite,
          finCompteur: article.finCompteur,
          DPU: article.DPU,
          imputation: article.imputation,
        });
        return acc;
      }, {});

      // Fusionner Manifolds et articles
      const ManifoldsWithArticles = Manifolds.map((Manifold) => ({
        ...Manifold,
        check1: Manifold.check1 === 1,
        check2: Manifold.check2 === 1,
        check3: Manifold.check3 === 1,
        locked1: Manifold.locked1 === 1,
        locked2: Manifold.locked2 === 1,
        locked3: Manifold.locked3 === 1,

        checkerNames: {
          1: Manifold.checker1_nom || "",
          2: Manifold.checker2_nom || "",
          3: Manifold.checker3_nom || "",
        },
        articles: articlesMap[Manifold.id] || [],
      }));

      return res.status(200).json(ManifoldsWithArticles);
    }

    /**
     * 🆕 POST — créer un nouveau Manifold de sortie
     */
    if (req.method === "POST") {
      const {
        Demandeur,
        recepteur,
        code1,
        code2,
        dateCommande,
        motif,
        check1,
        check2,
        check3,
        locked1,
        locked2,
        locked3,
        checkerNames,
        articles,
      } = req.body;

      // Insertion du Manifold principal
      const [result] = await db.query(
        `INSERT INTO manifold 
          (Demandeur, recepteur, code1, code2, dateCommande, motif, 
           check1, check2, check3, locked1, locked2, locked3, 
           checker1_nom, checker2_nom, checker3_nom)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Demandeur,
          recepteur,
          code1,
          code2,
          dateCommande,
          motif,
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

      const newManifoldId = result.insertId;

      // 2️⃣ Insertion des articles associés
      await insertArticles(newManifoldId, articles);

      const ManifoldDeSortie = {
        id: newManifoldId,
        Demandeur,
        recepteur,
        code1,
        code2,
        dateCommande,
        motif,
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

      return res.status(201).json({
        message: "Manifold créé avec succès",
        bonDeSortie: ManifoldDeSortie,
      });
    }

    /**
     * ✏️ PUT — mise à jour d’un Manifold de sortie existant
     */
    if (req.method === "PUT") {
      const {
        id,
        Demandeur,
        recepteur,
        code1,
        code2,
        dateCommande,
        motif,
        check1,
        check2,
        check3,
        locked1,
        locked2,
        locked3,
        checkerNames,
        articles,
      } = req.body;

      await db.query(
        `UPDATE manifold SET
            Demandeur = ?, recepteur = ?, code1 = ?, code2 = ?, dateCommande = ?, motif = ?,
            check1 = ?, check2 = ?, check3 = ?, 
            locked1 = ?, locked2 = ?, locked3 = ?,
            checker1_nom = ?, checker2_nom = ?, checker3_nom = ?
           WHERE id = ?`,
        [
          Demandeur,
          recepteur,
          code1,
          code2,
          dateCommande,
          motif,
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

      try {
        await db.query("DELETE FROM articles_manifold WHERE manifold_id = ?", [
          id,
        ]);
        await insertArticles(id, articles);
      } catch (articleError) {
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

    return res.status(405).json({ message: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur API manifold:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur : " + error.message });
  }
}
