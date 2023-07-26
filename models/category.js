import { model, Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "The category name is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, "The category status is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "The user is required"],
  },
});

categorySchema.methods.toJSON = function () {
  const { __v, status, ...category } = this.toObject();

  return category;
};

export const Category = model("Category", categorySchema);
