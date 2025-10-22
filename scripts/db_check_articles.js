const { db } = require('../lib/db');

async function main(){
  try{
    const [rows] = await db.query('SELECT bon_de_sortie_id, COUNT(*) as cnt FROM articles_sortie GROUP BY bon_de_sortie_id ORDER BY bon_de_sortie_id');
    console.log('Articles per bon_de_sortie_id:');
    console.table(rows);
  }catch(e){
    console.error('DB error', e);
  } finally{
    process.exit(0);
  }
}

main();