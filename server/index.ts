import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// Setup uploads folder
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

// Multer config for 10MB limit
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.post('/api/upload', authGuard, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

const JWT_SECRET = 'mda-super-secret-key-change-in-prod';

// --- AUTH --- //

// Create default user on startup
const setupDefaultUser = async () => {
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get('anderson@mda.com.br');
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('@Anderson', 10);
        db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run('anderson@mda.com.br', hashedPassword);
        console.log('Default user created: anderson@mda.com.br');
    }
};
setupDefaultUser();

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, email: user.email });
});

// Middleware to protect routes
const authGuard = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token ausente' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// --- CATEGORIES --- //

app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
});

app.post('/api/categories', authGuard, (req, res) => {
    const { id, name, icon } = req.body;
    try {
        const result = db.prepare('INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)').run(id, name, icon || 'Leaf');
        res.json({ id, name, icon });
    } catch (err) {
        res.status(400).json({ error: 'Erro ao criar categoria ou ID já existe' });
    }
});

app.delete('/api/categories/:id', authGuard, (req, res) => {
    try {
        db.prepare('DELETE FROM products WHERE category = ?').run(req.params.id);
        db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao excluir' });
    }
});

app.patch('/api/categories/:id', authGuard, (req, res) => {
    const { name } = req.body;
    db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, req.params.id);
    res.json({ success: true });
});

// --- PRODUCTS --- //

app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products ORDER BY name ASC').all();
    res.json(products);
});

// Create product
app.post('/api/products', authGuard, upload.single('image'), (req, res) => {
    const { category, name, weight, desc, shopee_link, mercadolivre_link, amazon_link, aliexpress_link } = req.body;

    let imgPath = req.body.img;
    if (req.file) {
        imgPath = '/uploads/' + req.file.filename;
    }

    if (!imgPath) {
        return res.status(400).json({ error: 'Imagem é obrigatória' });
    }

    const result = db.prepare(`
    INSERT INTO products (category, name, weight, desc, img, hidden, favorito, is_combo, variacoes, shopee_link, mercadolivre_link, amazon_link, aliexpress_link) 
    VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?)
  `).run(category, name, weight, desc, imgPath, is_combo ? 1 : 0, variacoes, shopee_link, mercadolivre_link, amazon_link, aliexpress_link);

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.json(newProduct);
});

// Update product
app.put('/api/products/:id', authGuard, upload.single('image'), (req, res) => {
    const { category, name, weight, desc, hidden, shopee_link, mercadolivre_link, amazon_link, aliexpress_link } = req.body;
    const isHidden = hidden === 'true' || hidden === true ? 1 : 0;

    let imgPath = req.body.img;
    if (req.file) {
        imgPath = '/uploads/' + req.file.filename;
    }

    db.prepare(`
    UPDATE products 
    SET category = ?, name = ?, weight = ?, desc = ?, img = COALESCE(?, img), hidden = ?, 
        is_combo = ?, variacoes = ?, shopee_link = ?, mercadolivre_link = ?, amazon_link = ?, aliexpress_link = ?
    WHERE id = ?
  `).run(category, name, weight, desc, imgPath, isHidden, is_combo ? 1 : 0, variacoes, shopee_link, mercadolivre_link, amazon_link, aliexpress_link, req.params.id);

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updatedProduct);
});

app.patch('/api/products/:id/favorito', authGuard, (req, res) => {
    const { favorito } = req.body;
    db.prepare('UPDATE products SET favorito = ? WHERE id = ?').run(favorito ? 1 : 0, req.params.id);
    res.json({ success: true });
});

app.delete('/api/products/:id', authGuard, (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

const setupInitialData = () => {
    const hasCategories = db.prepare('SELECT count(*) as count FROM categories').get() as any;
    if (hasCategories.count === 0) {
        const insertCat = db.prepare('INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)');
        insertCat.run('temperos', 'Temperos', 'Leaf');
        insertCat.run('chas', 'Chás e Ervas', 'Coffee');
        insertCat.run('graos', 'Grãos e Oleaginosas', 'Wheat');
        insertCat.run('desidratados', 'Frutas Desidratadas', 'Apple');
        insertCat.run('mel', 'Mel e Derivados', 'Zap');

        const insertProd = db.prepare('INSERT INTO products (category, name, weight, desc, img) VALUES (?, ?, ?, ?, ?)');

        // --- Temperos ---
        insertProd.run('temperos', 'Açafrão da Terra', '150g', 'Puro e vibrante, ideal para dar cor e sabor.', 'https://images.unsplash.com/photo-1615486171448-4afd3710501f?q=80&w=600&auto=format&fit=crop');
        insertProd.run('temperos', 'Chimichurri', '100g', 'O clássico argentino para o seu churrasco.', 'https://images.unsplash.com/photo-1599909618035-773a65573489?q=80&w=600&auto=format&fit=crop');
        insertProd.run('temperos', 'Páprica Defumada', '100g', 'Sabor intenso e aroma defumado marcante.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop');
        insertProd.run('temperos', 'Orégano Chileno', '50g', 'Folhas selecionadas com aroma superior.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop');

        // --- Chás ---
        insertProd.run('chas', 'Flor de Camomila', '50g', 'Calmante natural para noites tranquilas.', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=600&auto=format&fit=crop');
        insertProd.run('chas', 'Hibisco em Flor', '100g', 'Sabor marcante e propriedades antioxidantes.', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop');
        insertProd.run('chas', 'Canela em Casca', '50g', 'Aroma quente e adocicado para chás e doces.', 'https://images.unsplash.com/photo-1559144490-8328294fab4d?q=80&w=600&auto=format&fit=crop');

        // --- Grãos ---
        insertProd.run('graos', 'Castanha do Pará', '150g', 'Rica em selênio e fundamental para a saúde.', 'https://images.unsplash.com/photo-1599576822557-41a457199709?q=80&w=600&auto=format&fit=crop');
        insertProd.run('graos', 'Amêndoa Torrada', '150g', 'Crocante e nutritiva, fonte de vitamina E.', 'https://images.unsplash.com/photo-1599576822557-41a457199709?q=80&w=600&auto=format&fit=crop');
        insertProd.run('graos', 'Mix de Castanhas Premium', '200g', 'A combinação perfeita de energia e sabor.', 'https://images.unsplash.com/photo-1536588974558-812068804c86?q=80&w=600&auto=format&fit=crop');

        // --- Desidratados ---
        insertProd.run('desidratados', 'Damasco Turco', '200g', 'Doce e macio, rico em fibras e betacaroteno.', 'https://images.unsplash.com/photo-1595436065982-f54f676046e7?q=80&w=600&auto=format&fit=crop');
        insertProd.run('desidratados', 'Uva Passa Preta', '150g', 'Energia natural para seu dia a dia.', 'https://images.unsplash.com/photo-1595436065982-f54f676046e7?q=80&w=600&auto=format&fit=crop');
    }
};
setupInitialData();

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
});
