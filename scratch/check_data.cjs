const Database = require('better-sqlite3');
const db = new Database('produtosnaturais.db');
const categories = db.prepare('SELECT * FROM categories').all();
console.log('Categories:', categories);
const products = db.prepare('SELECT * FROM products LIMIT 5').all();
console.log('Products:', products);
