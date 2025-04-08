import userModel from "../models/user.model.js";
import * as bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

//  hash phone numbers for comparison with the hashed phone in the database when login using the phone
const rounds = parseInt(process.env.SALT_ROUND);
const hashPhoneNumber = (phoneNumber) => {
  return crypto.createHash("sha256").update(phoneNumber).digest("hex");
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "User_ID_Images",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});

export const upload = multer({ storage }).array("images", 2);

const register = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      confirmedPassword,
      role,
      phone,
      dob,
      address,
      idNumber,
      gender,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "No images uploaded" });
    }

    if (password !== confirmedPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    if (await userModel.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    if (await userModel.findOne({ idNumber })) {
      return res
        .status(400)
        .json({ success: false, message: "This National ID already exists" });
    }

    if (await userModel.findOne({ phone: hashPhoneNumber(phone) })) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists" });
    }

    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "You cannot register as an admin.",
      });
    }

    const hashPassword = bcrypt.hashSync(password, rounds);
    const hashedPhone = hashPhoneNumber(phone);
    const imageUrls = req.files.map((file) => file.path);

    const user = await userModel.create({
      userName,
      email,
      password: hashPassword,
      phone: hashedPhone,
      dob,
      address,
      idNumber,
      gender,
      images: imageUrls,
      role: "user",
      isVerified: false,
    });

    const objectUser = user.toObject();
    delete objectUser.password;

    const token = jwt.sign({ id: user._id }, process.env.CONFIRM_EMAIL_TOKEN, {
      expiresIn: "1d",
    });

    const url = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/auth/verify/${token}`;
    console.log(url);

    sendEmail(
      objectUser.email,
      "Email Confirmation Request",
      url,
      "confirm",
      objectUser.userName
    );

    res.status(200).json({
      message: "User registered successfully",
      objectUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    let query;

    // Check if identifier is phone or email
    if (/^\d{11}$/.test(identifier)) {
      query = { phone: hashPhoneNumber(identifier) };
    } else {
      query = { email: identifier };
    }

    // Find user by email OR hashed phone
    const user = await userModel.findOne(query);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist. Please register first." });
    }

    console.log("✅ User found. Checking password...");
    //  Optional: Require email confirmation before login
    //  if (!user.confirmEmail) {
    //     return res.status(403).json({ message: "Please verify your email before logging in." });
    //   }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, isVerified: user.isVerified },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "20h" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error("🔥 Internal Server Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    // Extract token from request params
    const { token } = req.params;
    if (!token) {
      return res.status(400).send("Token is required");
    }

    const decoded = jwt.verify(token, process.env.CONFIRM_EMAIL_TOKEN);

    // Update user email confirmation status
    const user = await userModel.findOneAndUpdate(
      { _id: decoded.id },
      { confirmEmail: true },
      { new: true } // Return updated document
    );
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verified</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  padding: 50px;
                  background-color: #f4f4f4;
              }
              .container {
                  background: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                  display: inline-block;
              }
              h1 {
                  color: #4CAF50;
              }
              p {
                  font-size: 18px;
              }
          
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Email Verified ✅</h1>
              <p>Your email has been successfully verified. 
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).send("Token is not valid");
    }
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export { register, login, verifyEmail };
