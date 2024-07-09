const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const product = require('../models/product');
const { authenticateAdminToken, authenticateToken} = require('../middleware/auth');



// Product Registration
router.post('/create',authenticateAdminToken, productController.create);

// Product Details
router.get('/getAllProducts', productController.getAllProducts);

// Product Fetch
router.get('/fetch/:id', productController.fetch)

// Update Product
router.put('/update/:id', authenticateAdminToken, productController.update);

// Delete Product
router.delete('/delete/:id', authenticateAdminToken, productController.deleteProduct);

module.exports = router;
