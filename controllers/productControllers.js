import Product from '../models/productModel.js';
import apiResponse from '../helper/apiResponse.js';
import logger from '../utils/logger.js';

/**
 * Get all products for the authenticated user
 */
export const getProducts = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'User not authenticated');

  try {
    const products = await Product.findAll({ where: { user_id: userId } });
    logger.info(`Fetched ${products.length} products for user ${userId}`);
    return apiResponse(res, 200, true, 'Products fetched successfully', products);
  } catch (error) {
    logger.error(`Error fetching products for user ${userId}: ${error.message}`);
    return apiResponse(res, 500, false, 'Failed to fetch products');
  }
};

/**
 * Get a single product by its ID for the authenticated user
 * @param {string} productId - Product ID in URL params
 */
export const getProduct = async (req, res) => {
  const userId = req.user_id;
  const { productId } = req.params;

  if (!userId) return apiResponse(res, 401, false, 'User not authenticated');

  try {
    const product = await Product.findOne({ where: { id: productId, user_id: userId } });

    if (!product) {
      logger.warn(`Product ${productId} not found for user ${userId}`);
      return apiResponse(res, 404, false, 'Product not found');
    }

    logger.info(`Product ${productId} fetched for user ${userId}`);
    return apiResponse(res, 200, true, 'Product fetched successfully', product);
  } catch (error) {
    logger.error(`Error fetching product ${productId}: ${error.message}`);
    return apiResponse(res, 500, false, 'Failed to fetch product');
  }
};

/**
 * Create a new product for the authenticated user
 */
export const createProduct = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'User not authenticated');

  const { name, currency, category, price, product_image, discount } = req.body;

  if (!name || !currency || !category || !price) {
    return apiResponse(res, 400, false, 'Name, currency, category, and price are required');
  }

  try {
    const product = await Product.create({
      user_id: userId,
      name,
      currency,
      category,
      price,
      product_image,
      discount,
    });

    logger.info(`Product ${product.id} created by user ${userId}`);
    return apiResponse(res, 201, true, 'Product created successfully', product.id);
  } catch (error) {
    logger.error(`Error creating product for user ${userId}: ${error.message}`);
    return apiResponse(res, 500, false, 'Failed to create product');
  }
};

/**
 * Update a product owned by the authenticated user
 */
export const updateProduct = async (req, res) => {
  const userId = req.user_id;
  const { productId } = req.params;
  const { name, currency, category, price, product_image, discount } = req.body;

  if (!userId) return apiResponse(res, 401, false, 'User not authenticated');

  try {
    const [updated] = await Product.update(
      {
        name,
        currency,
        category,
        price,
        product_image,
        discount,
        updated_at: new Date(),
      },
      {
        where: { id: productId, user_id: userId },
      }
    );

    if (updated === 0) {
      logger.warn(`Product ${productId} not found or unchanged for user ${userId}`);
      return apiResponse(res, 404, false, 'Product not found or not updated');
    }

    logger.info(`Product ${productId} updated by user ${userId}`);
    return apiResponse(res, 200, true, 'Product updated successfully');
  } catch (error) {
    logger.error(`Error updating product ${productId}: ${error.message}`);
    return apiResponse(res, 500, false, 'Failed to update product');
  }
};

/**
 * Delete a product owned by the authenticated user
 */
export const deleteProduct = async (req, res) => {
  const userId = req.user_id;
  const { productId } = req.params;

  if (!userId) return apiResponse(res, 401, false, 'User not authenticated');

  try {
    const deleted = await Product.destroy({
      where: { id: productId, user_id: userId },
    });

    if (!deleted) {
      logger.warn(`Product ${productId} not found for deletion by user ${userId}`);
      return apiResponse(res, 404, false, 'Product not found');
    }

    logger.info(`Product ${productId} deleted by user ${userId}`);
    return apiResponse(res, 200, true, 'Product deleted successfully');
  } catch (error) {
    logger.error(`Error deleting product ${productId}: ${error.message}`);
    return apiResponse(res, 500, false, 'Failed to delete product');
  }
};
