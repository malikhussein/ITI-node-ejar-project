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
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
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
    daily: { type: Number, required: true }, 
    weekly: { type: Number }, 
    monthly: { type: Number } 
  },
  rating: {
    type: Number,
    default: 0,
  },

    reviews: {
      type: Number,
      default: 0,
  },
  // reviews: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Reviews',
  //   default: 0,
  // },

  images: {
    type: [String], 
    validate: [arrayLimit, "You can upload up to 4 images only"],
  },
});

function arrayLimit(val) {
  return val.length <= 4;
}


rentalSchema.pre("save", function (next) {
  if (this.price.daily) {
    this.price.weekly = this.price.daily * 7;  
    this.price.monthly = this.price.daily * 30; 
  }
  next();
});


const product = model("Product", productSchema);

export default product;
