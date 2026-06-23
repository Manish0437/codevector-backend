import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    category:String,

    price:Number,

    productId:{
        type:Number,
        unique:true
    }
},
{
    timestamps:true
});


productSchema.index({
    createdAt: -1,
    _id: -1
});


productSchema.index({
    category: 1,
    createdAt: -1
});


const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
