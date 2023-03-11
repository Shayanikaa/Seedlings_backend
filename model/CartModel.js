const mongoose = require("mongoose");

const cart = new mongoose.Schema({
    id_num: {
        type: Number,
    },
    name:{
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    image:{
        type: String
    },
    description:{
        type: String,
    },
    category:{
        type: String,
    },
    subCategory:{
        type: String,
    },
    quantity:{
        type: Number,
    },
    stock:{
        type: Number,
    },
    rating:{
        type: Number,
    },
    reviews:{
        type: Number,
    },
    company:{
        type: String,

    }

},
{ collection:'cart-form'});

const model = mongoose.model('cartData',cart);
module.exports = model