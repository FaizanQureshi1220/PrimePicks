const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// Homepage route - Get all products
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, brand, minPrice, maxPrice } = req.query;
        
        // Get products from external API
        const skip = (page - 1) * limit;
        const products = await productService.getAllProducts(100, 0); // Get all products first
        
        let filteredProducts = [...products];
        
        // Apply filters
        if (category) {
            filteredProducts = filteredProducts.filter(product => 
                product.category === category
            );
        }
        
        if (brand) {
            filteredProducts = filteredProducts.filter(product => 
                product.brand.toLowerCase() === brand.toLowerCase()
            );
        }
        
        if (minPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price >= parseFloat(minPrice)
            );
        }
        
        if (maxPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price <= parseFloat(maxPrice)
            );
        }
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            message: 'Products retrieved successfully',
            data: {
                products: paginatedProducts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(filteredProducts.length / limit),
                    totalProducts: filteredProducts.length,
                    productsPerPage: parseInt(limit)
                }
            }
        });
        
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const skip = (page - 1) * limit;
        const products = await productService.getProductsByCategory(category, limit, skip);
        
        res.json({
            success: true,
            message: `${category} products retrieved successfully`,
            data: {
                category,
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(products.length / limit),
                    totalProducts: products.length,
                    productsPerPage: parseInt(limit)
                }
            }
        });
        
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
});

// Get products by gender
router.get('/gender/:gender', async (req, res) => {
    try {
        const { gender } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        // Validate gender parameter
        const validGenders = ['men', 'women', 'unisex'];
        if (!validGenders.includes(gender)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid gender parameter. Must be men, women, or unisex'
            });
        }
        
        // Get all products and filter by gender
        const allProducts = await productService.getAllProducts(100, 0);
        const filteredProducts = allProducts.filter(product => 
            product.gender === gender || product.gender === 'unisex'
        );
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        res.json({
            success: true,
            message: `${gender} products retrieved successfully`,
            data: {
                gender,
                products: paginatedProducts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(filteredProducts.length / limit),
                    totalProducts: filteredProducts.length,
                    productsPerPage: parseInt(limit)
                }
            }
        });
        
    } catch (error) {
        console.error('Get products by gender error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        
        res.json({
            success: true,
            message: 'Product retrieved successfully',
            data: { product }
        });
        
    } catch (error) {
        console.error('Get product by ID error:', error);
        if (error.message === 'Product not found') {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
});

// Search products
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const skip = (page - 1) * limit;
        const searchResults = await productService.searchProducts(query, limit, skip);
        
        res.json({
            success: true,
            message: 'Search completed successfully',
            data: {
                query,
                products: searchResults,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(searchResults.length / limit),
                    totalProducts: searchResults.length,
                    productsPerPage: parseInt(limit)
                }
            }
        });
        
    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await productService.getCategories();
        
        res.json({
            success: true,
            message: 'Categories retrieved successfully',
            data: { categories }
        });
        
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
});

module.exports = router; 