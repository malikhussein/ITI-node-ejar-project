import { Schema, model } from "mongoose";

const productSchema = new Schema({

  renterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Schema.Types.ObjectId,
    ref: 'Reviews',
    default: 0,
  },
  type: {
    type: String,
    required: true,
  },
  steering: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
  gasoline: {
    type: String,
    required: true,
  },
  images: {
    type: [String], 
    validate: [arrayLimit, "You can upload up to 4 images only"],
  },
});

function arrayLimit(val) {
  return val.length <= 4;
}

const product = model("Product", productSchema);

export default product;
