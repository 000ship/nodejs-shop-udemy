// Importing express framework
const express = require('express');
// const path = require('path');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

// Initialize and run this file as a Router because of ()
const router = express.Router();

// Middlewares ...
// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
        body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
        body('imageUrl'),
        body('price')
        .isFloat(),
        body('description')
        .isLength({ min: 8, max: 400 })
        .trim()
    ],
    isAuth, adminController.postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', [
        body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
        body('imageUrl'),
        body('price')
        .isFloat(),
        body('description')
        .isLength({ min: 8, max: 400 })
        .trim()
    ],
    isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

// Export router
module.exports = router;