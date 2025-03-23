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
      message: "Categories not found",
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: category,
      message: "Category found",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category not found",
    });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, icon } = req.body;

    if (!name || !description || !icon) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and icon are required",
      });
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name, description, icon },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID",
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update category",
    });
  }
};
