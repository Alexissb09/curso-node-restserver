import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "The product name is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, "The product status is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user is required"],
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
  },
});

ProductSchema.methods.toJSON = function () {
  const { __v, status, user, ...product } = this.toObject();

  product.user = user._id;

  return product;
};

export const Product = model("Product", ProductSchema);
