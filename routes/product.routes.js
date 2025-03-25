import { Router } from "express";
import {
  addProduct,
  getAllProducts,
  getOneProduct,
  removeProduct,
  updateProduct,
  upload,
} from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const Productrouter = Router();

Productrouter.post("/", authMiddleware,upload, addProduct);
Productrouter.post("/:id", upload, updateProduct);
Productrouter.get("/:id", getOneProduct);
Productrouter.get("/", getAllProducts);
Productrouter.delete("/:id", removeProduct);

export default Productrouter;
