import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productRouter from './routes/productsRoutes.js';
import userRouter from './routes/userRoutes.js';
import billsRouter from './routes/billsRoutes.js';

dotenv.config();

// Set Mongoose options
mongoose.set('strictQuery', false);

// Connect with MongoDB
mongoose.connect('mongodb://atlas-sql-65fac68a2be52242a0a23896-etalj.a.query.mongodb.net/Maduka-Grocery?ssl=true&authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB Atlas");
})
.catch((err) => {
  console.log("Error connecting to MongoDB Atlas:", err);
});

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Routes
app.get('/', (req, res) => {
    res.send('Maduka Grocery Store......  WE  ARE LIVE');
});
app.use('/api/products/', productRouter);
app.use('/api/users/', userRouter);
app.use('/api/bills/', billsRouter);

// Create Port 
const PORT = process.env.PORT || 5000;

// Listen
app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
});
