
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Dairy', 'Pantry', 'Meat', 'Produce', 'Seafood', 'Spices'],
  },
  image: {
    type: String,
    default: '',
  },
  countInStock: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: [0, 'Stock count cannot be negative'],
  },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);