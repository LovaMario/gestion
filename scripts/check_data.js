// Diagnostic script: fetch /api/bonDeSortie and /api/manifold and print counts
const HOST = process.env.HOST || 'http://localhost:3000';

async function fetchJson(path) {
  const res = await fetch(`${HOST}${path}`);
  const data = await res.json();
  return { status: res.status, data };
}

async function check() {
  console.log('Checking /api/bonDeSortie ...');
  try {
    const b = await fetchJson('/api/bonDeSortie');
    console.log('Status:', b.status);
    if (Array.isArray(b.data)) {
      console.log('Total bons:', b.data.length);
      b.data.slice(0, 10).forEach((bon) => {
        console.log(`Bon id=${bon.id} piece=${bon.piece} articles=${(bon.articles||[]).length}`);
      });
    } else {
      console.log('bonDeSortie response:', JSON.stringify(b.data).slice(0,500));
    }
  } catch (e) {
    console.error('Error fetching bonDeSortie:', e);
  }

  console.log('\nChecking /api/manifold ...');
  try {
    const m = await fetchJson('/api/manifold');
    console.log('Status:', m.status);
    if (Array.isArray(m.data)) {
      console.log('Total manifolds:', m.data.length);
      m.data.slice(0, 10).forEach((man) => {
        console.log(`Manifold id=${man.id} articles=${(man.articles||[]).length}`);
      });
    } else {
      console.log('manifold response:', JSON.stringify(m.data).slice(0,500));
    }
  } catch (e) {
    console.error('Error fetching manifold:', e);
  }
}

check().catch(e=>{console.error(e); process.exit(1)});