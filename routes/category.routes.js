import { Router } from "express";
import { createCategory, getAllCategories } from "../controllers/category.controller.js";

const categoryRoutes = Router();


//create category
categoryRoutes.post("/", createCategory);

//get all categories
categoryRoutes.get("/", getAllCategories)
//get single category
categoryRoutes.get("/:id", (req, res) => {
  res.send("Single Category route");
});

//update category
categoryRoutes.put("/:id", (req, res) => {
  res.send("Update Category route");
});

//delete category
categoryRoutes.delete('/:id', (req, res) => {
  res.send('Delete Category route');
});

export default categoryRoutes;
