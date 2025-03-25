import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    renterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "available",
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    daily: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      validate: [arrayLimit, "You can upload up to 4 images only"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  }
);
function arrayLimit(val) {
  return val.length <= 4;
}

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" })
      .populate({ path: "renterId", select: " userName  _id" });
  next();
});

// productSchema.pre("save", function (next) {
//   if (this.daily) {
//     this.weekly = this.daily * 7;  
//     this.monthly = this.daily * 30; 
//   }
//   next();
// });


const product = model("Product", productSchema);

export default product;
