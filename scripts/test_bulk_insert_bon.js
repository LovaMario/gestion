// Test script: create 2 bon_de_sortie entries with many articles each
const HOST = process.env.HOST || 'http://localhost:3000';

async function postBon(bon) {
  const res = await fetch(`${HOST}/api/bonDeSortie`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bon),
  });
  const body = await res.json();
  return { status: res.status, body };
}

function makeArticle(i) {
  return {
    codeArticle: `C-${i}`,
    libelleArticle: `Article ${i}`,
    quantite: Math.floor(Math.random()*10)+1,
    unite: 'U',
    imputation: 'Test',
    imputationCode: null,
    commande: '',
  };
}

async function main(){
  for(let m=1;m<=2;m++){
    const articles = [];
    for(let i=1;i<=100;i++) articles.push(makeArticle(i));
    const bon = {
      piece: m,
      manuelle: m,
      magasin: 'Central',
      depot: 'Central',
      dateSortie: new Date().toISOString(),
      departement: 'Fer',
      atelier: 'Atelier',
      secteur: 'AD',
      articles,
      check1: false, check2:false, check3:false,
      locked1:false, locked2:false, locked3:false,
      checkerNames:{1:'',2:'',3:''}
    };
    const r = await postBon(bon);
    console.log('Bon', m, 'status', r.status);
    console.log(JSON.stringify(r.body).slice(0,300));
  }
}

main().catch(e=>{console.error(e);process.exit(1)});