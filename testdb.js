const { Client } = require('pg');
const passwords = ['postgres', 'root', 'admin', 'password', '123456', ''];
async function test() {
  for (let p of passwords) {
    const client = new Client({ connectionString: `postgres://postgres:${p}@localhost:5432/postgres` });
    try {
      await client.connect();
      console.log('SUCCESS WITH PASSWORD: ' + p);
      await client.end();
      return;
    } catch(e) {
      console.log('Failed: ' + p);
    }
  }
}
test();
