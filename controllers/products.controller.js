import { Product } from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const { status, ...body } = req.body;

    const name = req.body.name.toUpperCase();

    const productDB = await Product.findOne({ name });

    if (productDB) {
      return res.status(400).json({
        message: `The product ${name} is already registered`,
      });
    }

    const data = {
      ...body,
      name,
      user: req.userAuth._id,
    };

    const product = new Product(data);
    await product.save();

    res.status(201).json({
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async (req, res) => {
  try {
    const { limit, from } = req.query;

    const [products, count] = await Promise.all([
      Product.find()
        .skip(Number(from))
        .limit(Number(limit))
        .populate("user")
        .exec(),
    ]);

    res.status(200).json({
      count,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params.id;

    const product = await Product.findById(id);

    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    if (data.name) {
      data.name = data.name.toUpperCase();
    }

    data.user = req.userAuth._id;

    const productUpdated = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({ productUpdated });
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productDeleted = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    res.status(200).json({ productDeleted });
  } catch (error) {
    console.log(error);
  }
};
