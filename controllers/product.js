const Product = require('../models/product');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const create = async(req, res) => {
    try{
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category
        });

        const newProduct = await product.save();
        res.status(201).json({message: 'Product registration successfull!', data:newProduct});

    }catch(err){
        res.status(400).json({message: err.message});
    }
}


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        
        if (products.length === 0) {
            return res.status(200).json({ message: 'Cart is empty' });
        }

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const fetch = async(req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            res.status(400).json({ message: 'Product not found' });
        }else{
            
            res.status(200).json({message: 'Product details fetched successfully!', data: product });
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
}


 
const update = async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
  
      const updates = req.body;
      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true, // Ensure that updates are validated
      });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res
        .status(200)
        .json({ message: "Product updated successfully!", data: product });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };


const deleteProduct = async (req, res) => {
    try {
        console.log('Delete product called');
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);

        if (!user) {
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product deleted');
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ message: err.message });
    }
};


module.exports = {
    create,
    getAllProducts,
    fetch,
    update,
    deleteProduct
};