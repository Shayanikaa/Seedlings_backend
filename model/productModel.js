const mongoose = require("mongoose");

const prod = new mongoose.Schema({
    id_num: {
        type: Number,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true,
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
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    subCategory:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    reviews:{
        type: Number,
    },
    company:{
        type: String,
        required: true,

    }

},
{ collection:'product-form'});

const model = mongoose.model('prodData',prod);
module.exports = model