import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRouter from './routes/productsRoutes.js';
import userRouter from './routes/userRoutes.js';
import billsRouter from './routes/billsRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Seed products for advertisement (subset for ticker and featured section)
const seedProducts = [
  { name: 'Milk (1L)', description: 'Fresh milk', price: 1.8, category: 'Dairy', image: '', countInStock: 80 },
  { name: 'Eggs (12)', description: 'Free-range eggs', price: 2.8, category: 'Dairy', image: '', countInStock: 100 },
  { name: 'Rice (2kg)', description: 'Long grain rice', price: 6.0, category: 'Pantry', image: '', countInStock: 25 },
  { name: 'Sugar (1kg)', description: 'White sugar', price: 1.5, category: 'Pantry', image: '', countInStock: 40 },
  { name: 'Olive Oil', description: 'Extra virgin', price: 8.0, category: 'Pantry', image: '', countInStock: 15 },
  { name: 'Turkey (1kg)', description: 'Fresh turkey meat', price: 5.5, category: 'Meat', image: '', countInStock: 30 },
  { name: 'Chicken (1kg)', description: 'Whole fresh chicken', price: 4.2, category: 'Meat', image: '', countInStock: 50 },
  { name: 'Yam (1 tuber)', description: 'Fresh Nigerian yam', price: 2.0, category: 'Produce', image: '', countInStock: 60 },
  { name: 'Egusi (500g)', description: 'Ground melon seeds for soup', price: 3.0, category: 'Pantry', image: '', countInStock: 35 },
  { name: 'Palm Oil (1L)', description: 'Pure red palm oil', price: 2.5, category: 'Pantry', image: '', countInStock: 20 },
  { name: 'Plantain (1kg)', description: 'Ripe plantains', price: 1.7, category: 'Produce', image: '', countInStock: 45 },
  { name: 'Garri (1kg)', description: 'Cassava flour for eba', price: 1.2, category: 'Pantry', image: '', countInStock: 70 },
  { name: 'Beans (1kg)', description: 'Brown beans for porridge', price: 2.0, category: 'Pantry', image: '', countInStock: 50 },
  { name: 'Fish (1kg)', description: 'Dried stockfish', price: 6.5, category: 'Seafood', image: '', countInStock: 20 },
  { name: 'Ogbono (500g)', description: 'Ground ogbono seeds for soup', price: 3.5, category: 'Pantry', image: '', countInStock: 30 },
  { name: 'Pepper (100g)', description: 'Dried scotch bonnet pepper', price: 1.0, category: 'Spices', image: '', countInStock: 100 },
  { name: 'Tomatoes (1kg)', description: 'Fresh tomatoes', price: 1.5, category: 'Produce', image: '', countInStock: 60 },
  { name: 'Onions (1kg)', description: 'Fresh red onions', price: 1.2, category: 'Produce', image: '', countInStock: 80 },
  { name: 'Crayfish (100g)', description: 'Ground dried crayfish', price: 2.0, category: 'Seafood', image: '', countInStock: 40 },
  { name: 'Vegetable Oil (1L)', description: 'Refined vegetable oil', price: 2.8, category: 'Pantry', image: '', countInStock: 25 },
  { name: 'Okra (500g)', description: 'Fresh okra for soup', price: 1.3, category: 'Produce', image: '', countInStock: 50 },
  { name: 'Ugu Leaves (500g)', description: 'Fresh pumpkin leaves', price: 1.0, category: 'Produce', image: '', countInStock: 60 },
  { name: 'Goat Meat (1kg)', description: 'Fresh goat meat', price: 6.0, category: 'Meat', image: '', countInStock: 25 },
  { name: 'Maggi Cubes (100g)', description: 'Seasoning cubes', price: 0.8, category: 'Spices', image: '', countInStock: 120 },
  { name: 'Pounded Yam Flour (1kg)', description: 'Yam flour for pounded yam', price: 2.5, category: 'Pantry', image: '', countInStock: 30 },
  { name: 'Semo (1kg)', description: 'Semolina flour for swallow', price: 2.0, category: 'Pantry', image: '', countInStock: 35 },
  { name: 'Bitterleaf (500g)', description: 'Dried bitterleaf for soup', price: 1.5, category: 'Produce', image: '', countInStock: 40 },
  { name: 'Beef (1kg)', description: 'Fresh beef cuts', price: 5.0, category: 'Meat', image: '', countInStock: 30 },
  { name: 'Curry Powder (100g)', description: 'Spice blend for seasoning', price: 0.9, category: 'Spices', image: '', countInStock: 90 },
  { name: 'Thyme (50g)', description: 'Dried thyme leaves', price: 0.7, category: 'Spices', image: '', countInStock: 100 },
  { name: 'Cassava (1kg)', description: 'Fresh cassava tubers', price: 1.8, category: 'Produce', image: '', countInStock: 50 },
  { name: 'Groundnut (500g)', description: 'Roasted groundnuts', price: 1.4, category: 'Pantry', image: '', countInStock: 60 },
  { name: 'Spinach (500g)', description: 'Fresh spinach for stew', price: 1.0, category: 'Produce', image: '', countInStock: 70 },
  { name: 'Millet (1kg)', description: 'Whole millet grains', price: 1.6, category: 'Pantry', image: '', countInStock: 40 },
  { name: 'Corn Flour (1kg)', description: 'Fine corn flour for pap', price: 1.5, category: 'Pantry', image: '', countInStock: 50 }
];
const messages = [
  "🛒 Welcome to Maduka Grocery Store — where freshness never sleeps!",
  "🥦 Your veggies are waiting… and they miss you.",
  "🍞 Bread just came out of the oven — hurry!",
  "🎉 Grocery shopping just got exciting. Let's go!"
];

// Featured products for display
const featuredProducts = [
  'Milk (1L)', 'Chicken (1kg)', 'Yam (1 tuber)', 'Egusi (500g)', 'Palm Oil (1L)', 
  'Bitterleaf (500g)', 'Semo (1kg)', 'Groundnut (500g)', 'Ugu Leaves (500g)', 
  'Cassava (1kg)', 'Spinach (500g)', 'Goat Meat (1kg)', 'Crayfish (100g)', 
  'Turkey (1kg)', 'Garri (1kg)'
].map(name => seedProducts.find(p => p.name === name)).filter(Boolean);

// Combine into ticker array
const tickerProducts = [
  ...messages,
  ...featuredProducts.map(p => `${p.name} - $${p.price.toFixed(2)}`)
];


// Welcome page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Maduka Grocery Store</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #fff;
            background: linear-gradient(135deg, #1a3c34, #4a7043, #88b04b);
            overflow-x: hidden;
            position: relative;
          }
          .ticker-wrap {
            width: 100%;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.85);
            border-top: 4px solid #ffd700;
            border-bottom: 4px solid #ffd700;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
            position: absolute;
            top: 0;
            z-index: 10;
          }
          .ticker {
            display: inline-block;
            white-space: nowrap;
            padding-left: 100%;
            animation: ticker 40s linear infinite;
            font-size: 2rem;
            font-weight: bold;
            color: #ffd700;
            transition: color 0.3s ease;
          }
          .ticker:hover {
            color: #ffea00;
            animation-play-state: paused;
          }
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .content {
            margin-top: 80px;
            text-align: center;
            z-index: 5;
            max-width: 1200px;
            width: 100%;
            padding: 20px;
          }
          .in-progress {
            font-size: 1.8rem;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.9);
            padding: 15px 30px;
            border: 3px solid #ffd700;
            border-radius: 12px;
            color: #ffd700;
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.7);
            margin-bottom: 30px;
          }
          .featured-products {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }
          .product-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 15px;
            width: 200px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            position: relative;
          }
          .product-card:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
          }
          .product-card h3 {
            margin: 10px 0;
            font-size: 1.2rem;
            color: #ffd700;
          }
          .product-card p {
            margin: 5px 0;
            font-size: 1rem;
            color: #fff;
          }
          .product-card .price {
            font-weight: bold;
            color: #ffea00;
          }
          .tooltip {
            visibility: hidden;
            background: #1a3c34;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.9rem;
            width: 180px;
            z-index: 20;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .product-card:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }
          .cta-button {
            margin: 30px 0;
            padding: 15px 30px;
            font-size: 1.2rem;
            font-weight: bold;
            background: #ffd700;
            color: #1a3c34;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .cta-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
          }
          .bubble {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            animation: floatUp 10s linear infinite;
            pointer-events: none;
          }
          @keyframes floatUp {
            0% { transform: translateY(100vh); opacity: 0.3; }
            100% { transform: translateY(-20vh); opacity: 0; }
          }
          @media (max-width: 768px) {
            .ticker { font-size: 1.5rem; }
            .in-progress { font-size: 1.4rem; padding: 10px 20px; }
            .product-card { width: 160px; }
            .product-card h3 { font-size: 1rem; }
            .product-card p { font-size: 0.9rem; }
            .cta-button { font-size: 1rem; padding: 10px 20px; }
          }
          @media (max-width: 480px) {
            .ticker { font-size: 1.2rem; }
            .in-progress { font-size: 1.2rem; padding: 8px 15px; }
            .product-card { width: 140px; }
            .product-card h3 { font-size: 0.9rem; }
            .product-card p { font-size: 0.8rem; }
            .cta-button { font-size: 0.9rem; padding: 8px 15px; }
          }
        </style>
      </head>
      <body>
        <div class="ticker-wrap">
          <div class="ticker">${tickerProducts.join(' ⚡ ')}</div>
        </div>
        <div class="content">
          <div class="in-progress">🚧 Maduka Grocery Store — Freshness in Progress! 🚧</div>
          <div class="featured-products">
            ${featuredProducts.map(product => `
              <div class="product-card">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p>${product.category}</p>
                <div class="tooltip">${product.description}</div>
              </div>
            `).join('')}
          </div>
          <button class="cta-button" onclick="window.location.href='/api/products'">
            Shop All Products Now!
          </button>
        </div>
        ${Array.from({ length: 25 }).map(() => {
          const size = Math.floor(Math.random() * 60) + 20;
          const left = Math.floor(Math.random() * 100);
          const delay = (Math.random() * 10).toFixed(2);
          return `<div class="bubble" style="width:${size}px; height:${size}px; left:${left}vw; animation-delay:${delay}s;"></div>`;
        }).join('')}
      </body>
    </html>
  `);
});

// Routes
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/bills', billsRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}\n${err.stack}`);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/bills', billsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});

