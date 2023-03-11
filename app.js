require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
require ("./connect/connection");
const cors = require("cors");
const user = require("./model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie-session");
const passport = require("passport");
const prodjson = require("./product.json");
const prod = require("./model/productModel");
const cart = require("./model/CartModel");
const passportSetup = require("./passport");
const cookieparser = require("cookie-parser");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    methods: "GET, POST, PUT DELETE",
    credentials: true
    
}));
app.use(
    cookie({
        name:"sess",
        keys:["shayu"],
    
    })
)
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieparser());


app.post("/signup", async(req,res)=>{
    console.log(req.body);
    try {
        const newPassword = await bcrypt.hash(req.body.password,10);
        const User = await user.create({
            name:req.body.name,
            email:req.body.email,
            password:newPassword
        })
        const token = jwt.sign(
            {
                name:User.name,
                email:User.email
            },process.env.SECRET
        )
        res.json({status:"ok",User:token})
    } catch (error) {
        res.json({status:"error"});
    }
})

app.post("/api/login",async(req,res)=>{
    try {
        const User = await user.findOne({
            email:req.body.email,
        })
        if(!User){
            return{
                status:"error",
                error:"Invalid login"
            }
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password,User.password);
        if(isPasswordMatch){
            const token = jwt.sign(
                {
                    name:User.name,
                    email:User.email
                },process.env.SECRET
            )
            res.json({status:"ok",User:token});
            console.log(token);
        
        }else{
            res.json({status:"not ok", User:false});
        }
    } catch (error) {
        res.json({status:"error"});
    }
})

const start = async()=>{
    try{
        await prod.create(prodjson);

    }catch(error){
        console.log(error);
    }
}
start();
app.get("/products", async (req, res) => {
    try {
        const products = await prod.find({});
        //console.log(products._id);
        res.json(products);
    } catch (error) {
        console.log(error);
    }
});

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await prod.findById(productId);
      console.log(product);
      const productDetails =await cart.create({
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        subCategory: product.subCategory,
        quantity: product.quantity,
        stock: product.stock,
        rating: product.rating,

        // Add any other fields you want to store in the "productDetails" database
      });
      await productDetails.save();
      console.log(product);
      if (!product) {
        return res.status(404).send('Product not found');
      }
      return res.json(product);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
  });
  
  app.get("/cart", async (req, res) => {
    try {
        const cartitem = await cart.find({});
        //console.log(products._id);
        res.json(cartitem);
    } catch (error) {
        console.log(error);
    }
});
app.get("/auth/google/callback", passport.authenticate("google",{
    successRedirect:"http://localhost:3000/products",
    failureRedirect:"login/failed"
}))

app.get("/login/failed",(req,res)=>{
    res.status(404).json({
        error:true,
        message:"login failure"
    })
})

app.get("/login/success",(req,res)=>{
    if(req.user){
        res.status(200).json({
            error:false,
            message:"successfully login",
            user:req.user
        })
    }
    else{
        res.status(403).json({
            error:true,
            message:"something went wrong"
        })
    }
})


app.get("/auth/google",passport.authenticate("google",["profile","email"]))

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});