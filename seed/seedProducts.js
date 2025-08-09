
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://atlas-sql-65fac68a2be52242a0a23896-etalj.a.query.mongodb.net/Maduka-Grocery?ssl=true&authSource=admin'

const products = [
  [
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
]
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Products seeded');

    // seed admin user
    await User.deleteMany();
    const admin = new User({ name: 'Admin', email: 'admin@maduka.test', password: 'Admin@123', isAdmin: true });
    await admin.save();
    console.log('Admin user seeded (password: Admin@123)');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
