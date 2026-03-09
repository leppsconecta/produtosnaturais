import { Leaf, Coffee, Wheat } from 'lucide-react';

export const categories = [
  { id: 'temperos', name: 'Temperos', icon: Leaf },
  { id: 'chas', name: 'Chás e Ervas', icon: Coffee },
  { id: 'graos', name: 'Grãos e Oleaginosas', icon: Wheat },
];

export const products = [
  // Temperos
  { id: 1, category: 'temperos', name: 'Açafrão da Terra', weight: '150g', desc: 'Puro e vibrante, ideal para dar cor e sabor.', img: 'https://images.unsplash.com/photo-1615486171448-4afd3710501f?q=80&w=600&auto=format&fit=crop' },
  { id: 2, category: 'temperos', name: 'Alecrim', weight: '50g', desc: 'Aroma fresco e intenso para carnes e batatas.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { id: 3, category: 'temperos', name: 'Chimichurri', weight: '100g', desc: 'O clássico argentino para o seu churrasco.', img: 'https://images.unsplash.com/photo-1599909618035-773a65573489?q=80&w=600&auto=format&fit=crop' },
  { id: 4, category: 'temperos', name: 'Pápricas (Doce, Defumada, Picante)', weight: '100g', desc: 'Escolha a sua versão favorita para dar aquele toque especial.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { id: 5, category: 'temperos', name: 'Pimenta do Reino', weight: '100g', desc: 'O tempero essencial para qualquer cozinha.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { id: 6, category: 'temperos', name: 'Orégano', weight: '50g', desc: 'Perfeito para pizzas, molhos e saladas.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { id: 7, category: 'temperos', name: 'Tempero Baiano', weight: '150g', desc: 'Mistura arretada para pratos cheios de sabor.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { id: 8, category: 'temperos', name: 'Tempero FIT', weight: '150g', desc: 'Sabor sem culpa para suas refeições saudáveis.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { id: 9, category: 'temperos', name: 'Tempero para Feijão', weight: '150g', desc: 'O segredo do feijão perfeito e encorpado.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { id: 10, category: 'temperos', name: 'Vinagrete', weight: '100g', desc: 'Praticidade e sabor para o seu churrasco.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  { id: 11, category: 'temperos', name: 'Lemon Pepper', weight: '150g', desc: 'Toque cítrico perfeito para aves e peixes.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' },
  
  // Chás
  { id: 12, category: 'chas', name: 'Canela em Casca', weight: '50g', desc: 'Aroma quente e adocicado para chás e doces.', img: 'https://images.unsplash.com/photo-1559144490-8328294fab4d?q=80&w=600&auto=format&fit=crop' },
  { id: 13, category: 'chas', name: 'Flor de Camomila', weight: '50g', desc: 'Calmante natural para noites tranquilas.', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=600&auto=format&fit=crop' },
  { id: 14, category: 'chas', name: 'Capim Limão', weight: '50g', desc: 'Refrescante e digestivo, ótimo quente ou gelado.', img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop' },
  { id: 15, category: 'chas', name: 'Chá Verde', weight: '100g', desc: 'Antioxidante poderoso e estimulante natural.', img: 'https://images.unsplash.com/photo-1627492276010-4ce2688b7277?q=80&w=600&auto=format&fit=crop' },
  { id: 16, category: 'chas', name: 'Hibisco', weight: '100g', desc: 'Sabor marcante e propriedades diuréticas.', img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop' },
  { id: 17, category: 'chas', name: 'Melissa', weight: '50g', desc: 'Erva cidreira para relaxar o corpo e a mente.', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=600&auto=format&fit=crop' },
  { id: 18, category: 'chas', name: 'Espinheira Santa', weight: '50g', desc: 'Aliada da digestão e saúde estomacal.', img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop' },
  { id: 19, category: 'chas', name: 'Cavalinha', weight: '50g', desc: 'Ação diurética e rica em minerais.', img: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=600&auto=format&fit=crop' },
  { id: 20, category: 'chas', name: 'Erva Doce', weight: '50g', desc: 'Sabor suave e propriedades digestivas.', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=600&auto=format&fit=crop' },
  { id: 21, category: 'chas', name: 'Cravo da Índia', weight: '50g', desc: 'Especiaria aromática e termogênica.', img: 'https://images.unsplash.com/photo-1559144490-8328294fab4d?q=80&w=600&auto=format&fit=crop' },
  
  // Grãos
  { id: 22, category: 'graos', name: 'Amendoim Torrado', weight: '200g', desc: 'Energia pura e sabor irresistível.', img: 'https://images.unsplash.com/photo-1599576822557-41a457199709?q=80&w=600&auto=format&fit=crop' },
  { id: 23, category: 'graos', name: 'Castanha de Caju', weight: '150g', desc: 'Torrada e crocante, fonte de boas gorduras.', img: 'https://images.unsplash.com/photo-1599576822557-41a457199709?q=80&w=600&auto=format&fit=crop' },
  { id: 24, category: 'graos', name: 'Castanha do Pará', weight: '150g', desc: 'Rica em selênio e muito nutritiva.', img: 'https://images.unsplash.com/photo-1599576822557-41a457199709?q=80&w=600&auto=format&fit=crop' },
  { id: 25, category: 'graos', name: 'Nozes', weight: '150g', desc: 'Perfeitas para lanches e receitas saudáveis.', img: 'https://images.unsplash.com/photo-1599576822557-41a457199709?q=80&w=600&auto=format&fit=crop' },
  { id: 26, category: 'graos', name: 'Mix de Castanhas', weight: '200g', desc: 'A combinação perfeita para o seu lanche.', img: 'https://images.unsplash.com/photo-1536588974558-812068804c86?q=80&w=600&auto=format&fit=crop' },
  { id: 27, category: 'graos', name: 'Ameixas', weight: '200g', desc: 'Doces, suculentas e ricas em fibras.', img: 'https://images.unsplash.com/photo-1536588974558-812068804c86?q=80&w=600&auto=format&fit=crop' },
  { id: 28, category: 'graos', name: 'Aveia', weight: '200g', desc: 'Base nutritiva para o seu café da manhã.', img: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=600&auto=format&fit=crop' },
  { id: 29, category: 'graos', name: 'Semente de Chia', weight: '150g', desc: 'Superalimento rico em fibras e ômega 3.', img: 'https://images.unsplash.com/photo-1588600878108-578307a3cc9d?q=80&w=600&auto=format&fit=crop' },
];
