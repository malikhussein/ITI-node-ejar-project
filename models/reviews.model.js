import mongoose, { Schema } from "mongoose";

const reviewShema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        ref: 'User',
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        default: 0,
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
    },
    processId:{
        type:Schema.Types.ObjectId,
        ref:"process"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
    
    /*
    image :{
        type: String,
        required: [true, 'Image is required'],
        ref: 'User',
    }*/

}, { timestamps: true });

const reviewModel = mongoose.model('Reviews', reviewShema);
export default reviewModel;

