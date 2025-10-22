// Script de test pour insérer en masse des manifolds avec articles
// Usage:
// 1) Démarrer votre serveur Next.js localement (ex: npm run dev)
// 2) node scripts/test_bulk_insert.js

const HOST = process.env.HOST || 'http://localhost:3000';

async function postManifold(manifold) {
  const res = await fetch(`${HOST}/api/manifold`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(manifold),
  });
  const data = await res.json();
  return { status: res.status, body: data };
}

function makeArticle(index) {
  return {
    NomArticle: `Article ${index}`,
    quantite: Math.floor(Math.random() * 10) + 1,
    unite: 'U',
    finCompteur: 0,
    DPU: '',
    imputation: '',
    code3: `CM-${index}`
  };
}

async function main() {
  console.log('Création de 2 manifolds avec 100 articles chacun...');

  for (let m = 1; m <= 2; m++) {
    const articles = [];
    for (let i = 1; i <= 100; i++) {
      articles.push(makeArticle(i));
    }

    const manifold = {
      Demandeur: `Atelier ${m}`,
      recepteur: `Dest ${m}`,
      code1: `C1-${m}`,
      code2: `C2-${m}`,
      dateCommande: new Date().toISOString(),
      motif: `Test insertion bulk manifold ${m}`,
      check1: false,
      check2: false,
      check3: false,
      locked1: false,
      locked2: false,
      locked3: false,
      checkerNames: { 1: '', 2: '', 3: '' },
      articles,
    };

    try {
      const r = await postManifold(manifold);
      console.log(`Manifold ${m} -> status: ${r.status}`);
      console.log(JSON.stringify(r.body).slice(0, 500));
    } catch (err) {
      console.error('Erreur POST manifold:', err);
    }
  }

  console.log('Terminé. Vérifiez la base de données (articles_manifold) pour confirmer.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
