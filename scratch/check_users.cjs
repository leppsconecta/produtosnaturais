const Database = require('better-sqlite3');
const db = new Database('produtosnaturais.db');
const users = db.prepare('SELECT id, email FROM users').all();
console.log(users);
