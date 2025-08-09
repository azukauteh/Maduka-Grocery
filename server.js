
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import connectDB from './config/db.js';  // Import DB connection

import productRouter from './routes/productsRoutes.js';
import userRouter from './routes/userRoutes.js';
import billsRouter from './routes/billsRoutes.js';

dotenv.config();

const app = express();


connectDB();  // Connect to MongoDB


app.use(cors());  // Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

const messages = [
  '🛒 Welcome to Maduka Grocery Store — where freshness never sleeps!',
  '🥦 Your veggies are waiting… and they miss you.',
  '🍞 Bread just came out of the oven — hurry!',
  "🎉 Grocery shopping just got exciting. Let's go!"
];

app.get('/', (req, res) => {
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  res.send(`
    <html>
      <head>
        <title>Maduka Grocery Store</title>
        <style>
          body {
            background: linear-gradient(135deg, #f5af19, #f12711);
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
          }
          .message {
            font-size: 2.5rem;
            padding: 20px;
            border: 3px solid white;
            border-radius: 15px;
            animation: pulse 2s infinite;
            box-shadow: 0 0 20px white;
            text-align: center;
            max-width: 600px;
          }
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 20px white; }
            50% { transform: scale(1.05); box-shadow: 0 0 40px #ffea00; }
            100% { transform: scale(1); box-shadow: 0 0 20px white; }
          }
          /* Floating bubbles background */
          .bubble {
            position: absolute;
            border-radius: 50%;
            opacity: 0.3;
            animation: floatUp 10s linear infinite;
          }
          @keyframes floatUp {
            0% { transform: translateY(100vh); opacity: 0.3; }
            100% { transform: translateY(-10vh); opacity: 0; }
          }
        </style>
      </head>
      <body>
        <div class="message">${randomMessage}</div>
        <!-- Generate floating bubbles -->
        ${Array.from({ length: 15 }).map(() => {
          const size = Math.floor(Math.random() * 40) + 10;
          const left = Math.floor(Math.random() * 100);
          const delay = (Math.random() * 10).toFixed(2);
          return `<div class="bubble" style="width:${size}px; height:${size}px; left:${left}vw; animation-delay:${delay}s; background: #fff;"></div>`;
        }).join('')}
      </body>
    </html>
  `);
});

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/bills', billsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});


  