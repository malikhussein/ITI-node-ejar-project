import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import Product from "../models/Product.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "User_Images",
    resource_type: "image", // هنا هنرفع صور
    allowedFormats: ["jpg", "jpeg", "png"],
  },
});

export const upload = multer({ storage }).array("images", 4);
export const addProduct = async (req, res) => {
  try {
    const { name, brand, description, category, daily, rating, reviews } =
      req.body;

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "No images uploaded" });
    }

    if (req.files.length > 4) {
      return res.status(400).json({
        status: "fail",
        message: "You can upload up to 4 images only",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Please upload at least one image." });
    }
    const imageUrls = req.files.map((file) => file.path);

    const newProduct = new Product({
      name,
      renterId: req.user.id,
      brand,
      category,
      description,
      daily,
      rating,
      reviews,
      images: imageUrls,
    });

    await newProduct.save();
    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      daily,
      rating,
      reviews,
      type,
      steering,
      capacity,
      gasoline,
      images,
      removeImages,
      confirmed,
      confirmMessage,
    } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }

    if (removeImages && removeImages.length > 0) {
      product.images = product.images.filter(
        (img) => !removeImages.includes(img)
      );
    }

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      product.images = [...product.images, ...imageUrls];
    }

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.daily = daily || product.daily;
    product.rating = rating || product.rating;
    product.reviews = reviews || product.reviews;
    product.type = type || product.type;
    product.steering = steering || product.steering;
    product.capacity = capacity || product.capacity;
    product.gasoline = gasoline || product.gasoline;
    product.images = images || product.images;
    product.confirmMessage = confirmMessage || product.confirmMessage;
    product.confirmed = confirmed;

    await product.save();

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("renterId", "username email")
      .populate("review");

    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    let prodid = req.params.id;
    if (!prodid) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid product ID" });
    }

    let theproduct = await Product.findById(prodid)
      .populate("category", "name")
      .populate("renterId", "username email")
      .populate("review");

    if (!theproduct) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product Not Found" });
    }

    res.status(200).json({ status: "success", data: theproduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    let prodid = req.params.id;
    if (!prodid) {
      return res
        .status(404)
        .json({ status: "fail", message: "invalid product id" });
    }

    let theProduct = await Product.findByIdAndDelete(prodid);

    res.status(200).json({ status: "success", message: "deleted" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
