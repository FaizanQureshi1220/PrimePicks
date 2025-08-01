const axios = require('axios');
const config = require('../config/database');

class ProductService {
    constructor() {
        this.apiUrl = config.api.productsUrl.replace(/\/$/, ''); // remove trailing slash if present
        console.log('ProductService constructor - apiUrl:', JSON.stringify(this.apiUrl));
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Get all products from external API
    async getAllProducts(limit = 100, skip = 0) {
        try {
            const cacheKey = `all_products_${limit}_${skip}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const url = `${this.apiUrl}?limit=${limit}&skip=${skip}`;
            console.log('getAllProducts - constructed URL:', JSON.stringify(url));
            const response = await axios.get(url);
            const products = response.data.products || [];
            
            // Transform products to match our schema
            const transformedProducts = products.map(product => ({
                id: product.id,
                name: product.title,
                brand: product.brand || 'Unknown',
                price: product.price,
                gender: this.determineGender(product.category),
                category: product.category,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
                description: product.description,
                sizes: this.generateSizes(product.category),
                colors: this.generateColors(product.category),
                inStock: product.stock > 0,
                stock: product.stock,
                rating: product.rating,
                discountPercentage: product.discountPercentage,
                thumbnail: product.thumbnail
            }));

            this.setCache(cacheKey, transformedProducts);
            return transformedProducts;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products from external API');
        }
    }

    // Get products by category
    async getProductsByCategory(category, limit = 20, skip = 0) {
        try {
            const cacheKey = `category_${category}_${limit}_${skip}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const url = `${this.apiUrl}/category/${category}?limit=${limit}&skip=${skip}`;
            const response = await axios.get(url);
            const products = response.data.products || [];
            
            const transformedProducts = products.map(product => ({
                id: product.id,
                name: product.title,
                brand: product.brand || 'Unknown',
                price: product.price,
                gender: this.determineGender(product.category),
                category: product.category,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
                description: product.description,
                sizes: this.generateSizes(product.category),
                colors: this.generateColors(product.category),
                inStock: product.stock > 0,
                stock: product.stock,
                rating: product.rating,
                discountPercentage: product.discountPercentage,
                thumbnail: product.thumbnail
            }));

            this.setCache(cacheKey, transformedProducts);
            return transformedProducts;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw new Error('Failed to fetch products by category');
        }
    }

    // Get product by ID
    async getProductById(id) {
        try {
            const cacheKey = `product_${id}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const url = `${this.apiUrl}/${id}`;
            const response = await axios.get(url);
            const product = response.data;
            
            const transformedProduct = {
                id: product.id,
                name: product.title,
                brand: product.brand || 'Unknown',
                price: product.price,
                gender: this.determineGender(product.category),
                category: product.category,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
                images: product.images || [],
                description: product.description,
                sizes: this.generateSizes(product.category),
                colors: this.generateColors(product.category),
                inStock: product.stock > 0,
                stock: product.stock,
                rating: product.rating,
                discountPercentage: product.discountPercentage,
                thumbnail: product.thumbnail
            };

            this.setCache(cacheKey, transformedProduct);
            return transformedProduct;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw new Error('Product not found');
        }
    }

    // Search products
    async searchProducts(query, limit = 20, skip = 0) {
        try {
            const cacheKey = `search_${query}_${limit}_${skip}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const url = `${this.apiUrl}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
            const response = await axios.get(url);
            const products = response.data.products || [];
            
            const transformedProducts = products.map(product => ({
                id: product.id,
                name: product.title,
                brand: product.brand || 'Unknown',
                price: product.price,
                gender: this.determineGender(product.category),
                category: product.category,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
                description: product.description,
                sizes: this.generateSizes(product.category),
                colors: this.generateColors(product.category),
                inStock: product.stock > 0,
                stock: product.stock,
                rating: product.rating,
                discountPercentage: product.discountPercentage,
                thumbnail: product.thumbnail
            }));

            this.setCache(cacheKey, transformedProducts);
            return transformedProducts;
        } catch (error) {
            console.error('Error searching products:', error);
            throw new Error('Failed to search products');
        }
    }

    // Get all categories
    async getCategories() {
        try {
            const cacheKey = 'categories';
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const url = `${this.apiUrl}/categories`;
            const response = await axios.get(url);
            const categories = response.data || [];
            
            this.setCache(cacheKey, categories);
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Failed to fetch categories');
        }
    }

    // Helper methods
    determineGender(category) {
        const menCategories = ['mens-shoes', 'mens-watches', 'mens-shirts', 'mens-bags'];
        const womenCategories = ['womens-shoes', 'womens-watches', 'womens-dresses', 'womens-bags'];
        
        if (menCategories.includes(category)) return 'men';
        if (womenCategories.includes(category)) return 'women';
        return 'unisex';
    }

    generateSizes(category) {
        if (category.includes('shoes') || category.includes('watches')) {
            return ['6', '7', '8', '9', '10', '11', '12'];
        }
        if (category.includes('shirts') || category.includes('dresses')) {
            return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        }
        return ['One Size'];
    }

    generateColors(category) {
        const commonColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple'];
        return commonColors.slice(0, Math.floor(Math.random() * 4) + 2); // 2-5 random colors
    }

    // Cache management
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }
}

module.exports = new ProductService(); 