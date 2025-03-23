import CategoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const newCategory = new CategoryModel({
      name,
      description,
      icon,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Category created successfully",
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    res.status(200).json({
      success: true,
      data: categories,
      message: "All Categories",
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
