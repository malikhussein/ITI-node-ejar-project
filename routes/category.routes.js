import { Router } from "express";

const categoryRoutes = Router();


//create category
categoryRoutes.post("/create", (req, res) => {
  res.send("Create Category route");
});

//get all categories
categoryRoutes.get("/all", (req, res) => {
  res.send("All Categories route");
});

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
