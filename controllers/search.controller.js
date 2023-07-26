import { Types } from "mongoose";
import { User } from "../models/user.js";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";

const collectionsAllowed = ["users", "categories", "products", "roles"];

const searchUsers = async (term = "", res) => {
  const isMongoId = Types.ObjectId.isValid(term);

  if (isMongoId) {
    const user = await User.findById(term);

    // If user was not found, then returns an empty array, (in first place returns null)
    return res.status(200).json({ results: user ? [user] : [] });
  }

  // insensitive term
  const regex = new RegExp(term, "i");

  const query = {
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  };

  const [user, count] = await Promise.all([
    User.find(query),
    User.count(query),
  ]);

  return res.status(200).json({ count, results: user ? [user] : [] });
};

const searchCategories = async (term = "", res) => {
  const isMongoId = Types.ObjectId.isValid(term);

  if (isMongoId) {
    const category = await Category.findById(term);

    // If category was not found, then returns an empty array, (in first place returns null)
    return res.status(200).json({
      results: category ? [category] : [],
    });
  }

  // Not case sensitive for term
  const regex = RegExp(term, "i");
  const query = { name: regex, $and: [{ status: true }] };

  const [categories, count] = await Promise.all([
    Category.find(query),
    Category.count(query),
  ]);

  return res
    .status(200)
    .json({ count, results: categories ? [categories] : [] });
};

const searchProducts = async (term = "", res) => {
  const isMongoId = Types.ObjectId.isValid(term);

  if (isMongoId) {
    const product = await Product.findById(term).populate("category", "name");

    return res.status(200).json({ results: product ? [product] : [] });
  }

  // Not case sensitive for term
  const regex = RegExp(term, "i");
  const query = {
    name: regex,
    $and: [{ status: true }],
  };

  const [products, count] = await Promise.all([
    Product.find(query).populate("category", "name"),
    Product.count(query),
  ]);
  return res.status(200).json({ count, products });
};

export const search = async (req, res) => {
  const { collection, term } = req.params;

  if (!collectionsAllowed.includes(collection)) {
    return res.status(400).json({
      message: `The collection: ${collection}, is not allowed to be searched`,
    });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;

    default:
      res.status(500).json({
        message: "You forget to realize the search",
      });
      break;
  }
};
