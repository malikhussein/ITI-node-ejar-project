import { Router } from "express";
import {
  addProduct,
  getAllProducts,
  getoneProduct,
  removeProduct,
  updateProduct,
  upload,
} from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const Productrouter = Router();

Productrouter.post("/", authMiddleware,upload, addProduct);
Productrouter.post("/:id", upload, updateProduct);
Productrouter.get("/:id", getoneProduct);
Productrouter.get("/", getAllProducts);
Productrouter.delete("/:id", removeProduct);

export default Productrouter;
