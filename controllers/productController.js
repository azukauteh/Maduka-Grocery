import Product from "../models/productModel.js";


/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: "success", data: products });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Public
 */
export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: errors.array() });
  }

  try {
    const { name, description, price, category, image, countInStock } = req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      countInStock,
    });
    const created = await product.save();
    res.status(201).json({ status: "success", data: created });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Public
 */
export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: errors.array() });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    res.status(200).json({ status: "success", data: updatedProduct });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public
 */
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    res.status(200).json({ status: "success", message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

