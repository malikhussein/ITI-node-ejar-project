import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [40, "Category name cannot exceed 40 characters"],
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
    },
  },
  { timestamps: true }
);

const CategoryModel = model("Category", categorySchema);

export default CategoryModel;
