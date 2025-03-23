import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

const categoryRoutes = Router();

//create category
categoryRoutes.post("/", createCategory);

//get all categories
categoryRoutes.get("/", getAllCategories);
//get single category
categoryRoutes.get("/:id", getCategoryById);

//update category
categoryRoutes.put("/:id", updateCategory);

//delete category
categoryRoutes.delete("/:id", (req, res) => {
  res.send("Delete Category route");
});

export default categoryRoutes;
