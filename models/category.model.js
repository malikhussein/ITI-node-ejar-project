import { model, Schema } from "mongoose";

const categorySChema = new Schema({
  name:{
    type: String,
    required: [true, 'Category name is required'],
    unique: [true, 'Category name must be unique'],
  }
}, {timestamps: true});

const CategoryModel = model('Category', categorySChema);

export default CategoryModel;