import Database from 'better-sqlite3';

const db = new Database('produtosnaturais.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    weight TEXT NOT NULL,
    desc TEXT NOT NULL,
    img TEXT NOT NULL,
    price REAL DEFAULT 0,
    hidden BOOLEAN DEFAULT 0,
    favorito BOOLEAN DEFAULT 0,
    is_combo BOOLEAN DEFAULT 0,
    variacoes TEXT,
    shopee_link TEXT,
    mercadolivre_link TEXT,
    amazon_link TEXT,
    aliexpress_link TEXT,
    FOREIGN KEY (category) REFERENCES categories (id)
  );
`);

// Migration helper to add missing columns to products
const tableInfo = db.prepare('PRAGMA table_info(products)').all() as { name: string }[];
const existingColumns = new Set(tableInfo.map(col => col.name));

const requiredColumns: { name: string; type: string }[] = [
  { name: 'price', type: 'REAL DEFAULT 0' },
  { name: 'favorito', type: 'BOOLEAN DEFAULT 0' },
  { name: 'is_combo', type: 'BOOLEAN DEFAULT 0' },
  { name: 'variacoes', type: 'TEXT' },
  { name: 'shopee_link', type: 'TEXT' },
  { name: 'mercadolivre_link', type: 'TEXT' },
  { name: 'amazon_link', type: 'TEXT' },
  { name: 'aliexpress_link', type: 'TEXT' }
];

for (const col of requiredColumns) {
  if (!existingColumns.has(col.name)) {
    try {
      db.exec(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
    } catch (e) {
      // Ignore if already added
    }
  }
}

// Table for Arquivos (Solapas, Adesivos, Códigos de Barras, Tabelas Nutricionais)
db.exec(`
  CREATE TABLE IF NOT EXISTS pastas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS arquivos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pasta TEXT NOT NULL,
    subcategoria TEXT NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    arquivo_url TEXT NOT NULL,
    formato TEXT DEFAULT 'JPG',
    tamanho TEXT DEFAULT '350 KB',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default pastas if empty
const countPastas = (db.prepare('SELECT COUNT(*) as count FROM pastas').get() as { count: number }).count;
if (countPastas === 0) {
  const insertPasta = db.prepare('INSERT INTO pastas (nome, slug) VALUES (?, ?)');
  insertPasta.run('Solapa e Adesivos', 'solapa_adesivos');
  insertPasta.run('Cód. Barras e Tabelas', 'cod_barras_tabelas');
}

// Seed default mock arquivos if empty
const countArquivos = (db.prepare('SELECT COUNT(*) as count FROM arquivos').get() as { count: number }).count;
if (countArquivos === 0) {
  const insertArquivo = db.prepare(`
    INSERT INTO arquivos (pasta, subcategoria, nome, descricao, arquivo_url, formato, tamanho)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertArquivo.run(
    'solapa_adesivos',
    'Solapa',
    'Solapa Embalagem 200g - Mix e Castanhas',
    'Arte final vetorizada com furo euro-slot padrão para sacos pouch de 200g.',
    '/mock-files/solapa-mda-embalagem-200g.jpg',
    'JPG',
    '680 KB'
  );

  insertArquivo.run(
    'solapa_adesivos',
    'Adesivo',
    'Adesivo Rótulo Frontal 100% Natural',
    'Adesivo redondo para lacre de embalagens stand-up e potes de vidro.',
    '/mock-files/solapa-mda-embalagem-200g.jpg',
    'PNG',
    '420 KB'
  );

  insertArquivo.run(
    'solapa_adesivos',
    'Solapa',
    'Solapa Tradicional - Temperos e Ervas',
    'Modelo gráfico oficial para linha de temperos 100g com identificação de lote.',
    '/mock-files/solapa-mda-embalagem-200g.jpg',
    'PDF',
    '850 KB'
  );

  insertArquivo.run(
    'cod_barras_tabelas',
    'Código de Barras',
    'Código de Barras EAN-13 - Açafrão da Terra',
    'Padrão EAN-13 (7898912345678) homologado GS1 Brasil para leitor ótico.',
    '/mock-files/codigo-de-barras-ean13.jpg',
    'JPG',
    '280 KB'
  );

  insertArquivo.run(
    'cod_barras_tabelas',
    'Código de Barras',
    'Código de Barras EAN-13 - Flor de Camomila',
    'Código de barras em alta definição para embalagens de chás 50g.',
    '/mock-files/codigo-de-barras-ean13.jpg',
    'PNG',
    '310 KB'
  );

  insertArquivo.run(
    'cod_barras_tabelas',
    'Tabela Nutricional',
    'Tabela Nutricional ANVISA - Castanhas e Grãos',
    'Tabela nutricional padrão RDC ANVISA por porção de 30g com %VD.',
    '/mock-files/tabela-nutricional-padrao.jpg',
    'JPG',
    '520 KB'
  );

  insertArquivo.run(
    'cod_barras_tabelas',
    'Tabela Nutricional',
    'Tabela Nutricional - Frutas Desidratadas',
    'Informação nutricional oficial para damasco turco e uvas passas 150g.',
    '/mock-files/tabela-nutricional-padrao.jpg',
    'JPG',
    '490 KB'
  );
}

// Ensure every product has a valid, working preview image and price
const productImageUpdates: { name: string; img: string; price: number; favorito: number }[] = [
  { name: 'Açafrão da Terra', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80', price: 12.90, favorito: 1 },
  { name: 'Chimichurri', img: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&auto=format&fit=crop&q=80', price: 15.00, favorito: 1 },
  { name: 'Páprica Defumada', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80', price: 14.00, favorito: 1 },
  { name: 'Orégano Chileno', img: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600&auto=format&fit=crop&q=80', price: 9.90, favorito: 0 },
  { name: 'Flor de Camomila', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&auto=format&fit=crop&q=80', price: 8.50, favorito: 1 },
  { name: 'Hibisco em Flor', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80', price: 10.00, favorito: 1 },
  { name: 'Canela em Casca', img: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80', price: 11.50, favorito: 0 },
  { name: 'Castanha do Pará', img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80', price: 25.00, favorito: 1 },
  { name: 'Amêndoa Torrada', img: 'https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=600&auto=format&fit=crop&q=80', price: 24.00, favorito: 0 },
  { name: 'Mix de Castanhas Premium', img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80', price: 22.00, favorito: 1 },
  { name: 'Damasco Turco', img: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600&auto=format&fit=crop&q=80', price: 26.90, favorito: 1 },
  { name: 'Uva Passa Preta', img: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80', price: 14.50, favorito: 0 },
];

try {
  const updateStmt = db.prepare('UPDATE products SET img = ?, price = ?, favorito = ? WHERE name = ?');
  for (const item of productImageUpdates) {
    updateStmt.run(item.img, item.price, item.favorito, item.name);
  }

  // Ensure Mel Puro Silvestre exists in 'mel' category
  const hasMel = db.prepare("SELECT COUNT(*) as count FROM products WHERE category = 'mel'").get() as { count: number };
  if (hasMel.count === 0) {
    db.prepare(`
      INSERT INTO products (category, name, weight, desc, img, price, favorito, shopee_link)
      VALUES ('mel', 'Mel Puro Silvestre', '300g', 'Mel 100% puro de florada silvestre, rico em nutrientes.', 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&auto=format&fit=crop&q=80', 28.90, 1, 'https://shopee.com.br/mda-mel-puro-silvestre')
    `).run();
  }

  db.prepare(`
    UPDATE products SET 
      shopee_link = 'https://shopee.com.br/mda-mix-castanhas-premium',
      mercadolivre_link = 'https://produto.mercadolivre.com.br/MLB-mda-mix-castanhas'
    WHERE name LIKE '%Castanha%' OR name LIKE '%Mix%'
  `).run();

  db.prepare(`
    UPDATE products SET 
      shopee_link = 'https://shopee.com.br/mda-acafrao-da-terra-puro',
      mercadolivre_link = 'https://produto.mercadolivre.com.br/MLB-mda-acafrao'
    WHERE name LIKE '%Açafrão%' OR name LIKE '%Chimichurri%'
  `).run();

  db.prepare(`
    UPDATE products SET 
      mercadolivre_link = 'https://produto.mercadolivre.com.br/MLB-mda-flor-de-camomila'
    WHERE name LIKE '%Camomila%' OR name LIKE '%Hibisco%'
  `).run();

  db.prepare(`
    UPDATE products SET 
      shopee_link = 'https://shopee.com.br/mda-damasco-turco-premium'
    WHERE name LIKE '%Damasco%'
  `).run();
} catch (e) {
  console.error('Error updating product images and links:', e);
}

export default db;
