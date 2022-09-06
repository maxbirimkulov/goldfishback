import mongoose from "mongoose";

const CardsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    priceSale: Number,
    category: {
        type: String,
        required: true
    },
    images: {
        type:String,
    },
    viewsCount : {
        type: Number,
        default: 0
    },
    time: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    playCount: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
})

export default  mongoose.model('Cards', CardsSchema)