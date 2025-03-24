import { Router } from "express";
import {
  addProduct,
  getAllProducts,
  getoneProduct,
  removeProduct,
  updateProduct,
  upload,
} from "../controllers/product.controller.js";

const Productrouter = Router();

Productrouter.post("/", upload, addProduct);
Productrouter.post("/:id", upload, updateProduct);
Productrouter.get("/:id", getoneProduct);
Productrouter.get("/", getAllProducts);
Productrouter.delete("/:id", removeProduct);

export default Productrouter;
