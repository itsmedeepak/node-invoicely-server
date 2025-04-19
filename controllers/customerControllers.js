import Customer from '../models/customerModel.js';
import apiResponse from '../helper/apiResponse.js';
import logger from '../utils/logger.js';
import { client, connectRedis } from '../cache/redis.js';

// Get all customers
export const getCustomers = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'User not authenticated');

  try {
    await connectRedis();
    const cacheKey = `customers:${userId}`;
    const cached = await client.get(cacheKey);

    if (cached) {
      logger.info(`Serving customers for user ${userId} from cache`);
      return apiResponse(res, 200, true, 'Customers fetched successfully (from cache)', JSON.parse(cached));
    }

    const customers = await Customer.findAll({ where: { user_id: userId } });

    await client.set(cacheKey, JSON.stringify(customers), { EX: 300 }); // Cache for 5 minutes
    return apiResponse(res, 200, true, 'Customers fetched successfully', customers);
  } catch (err) {
    logger.error('Failed to fetch customers:', err);
    return apiResponse(res, 500, false, 'Failed to fetch customers');
  }
};

// Get one customer
export const getCustomer = async (req, res) => {
  const { customerId } = req.params;
  const userId = req.user_id;

  if (!customerId) return apiResponse(res, 400, false, 'Customer ID is required');

  try {
    await connectRedis();
    const cacheKey = `customer:${userId}:${customerId}`;
    const cached = await client.get(cacheKey);

    if (cached) {
      logger.info(`Serving customer ${customerId} for user ${userId} from cache`);
      return apiResponse(res, 200, true, 'Customer fetched successfully (from cache)', JSON.parse(cached));
    }

    const customer = await Customer.findOne({ where: { _id: customerId, user_id: userId } });
    if (!customer) return apiResponse(res, 404, false, 'Customer not found');

    await client.set(cacheKey, JSON.stringify(customer), { EX: 300 });
    return apiResponse(res, 200, true, 'Customer fetched successfully', customer);
  } catch (err) {
    logger.error(`Failed to fetch customer (${customerId}):`, err);
    return apiResponse(res, 500, false, 'Failed to fetch customer');
  }
};

// Create customer
export const createCustomer = async (req, res) => {
  const userId = req.user_id;
  const {
    first_name,
    last_name,
    email,
    phone,
    street_address,
    city,
    state,
    country
  } = req.body;

  if (!first_name || !last_name || !email || !phone) {
    return apiResponse(res, 400, false, 'First name, last name, email, and phone are required');
  }

  try {
    const existing = await Customer.findOne({ where: { email, user_id: userId } });
    if (existing) return apiResponse(res, 409, false, 'Customer with this email already exists');

    const customer = await Customer.create({
      first_name,
      last_name,
      email,
      phone,
      street_address,
      city,
      state,
      country,
      user_id: userId,
    });

    await connectRedis();
    await client.del(`customers:${userId}`); // Invalidate customer list cache

    return apiResponse(res, 201, true, 'Customer created successfully', customer._id);
  } catch (err) {
    logger.error('Failed to create customer:', err);
    return apiResponse(res, 500, false, 'Failed to create customer');
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  const { customerId } = req.params;
  const userId = req.user_id;
  const {
    first_name,
    last_name,
    email,
    phone,
    street_address,
    city,
    state,
    country
  } = req.body;

  try {
    const [updated] = await Customer.update(
      {
        first_name,
        last_name,
        email,
        phone,
        street_address,
        city,
        state,
        country,
      },
      { where: { _id: customerId, user_id: userId } }
    );

    if (updated === 0)
      return apiResponse(res, 404, false, 'Customer not found or not updated');

    await connectRedis();
    await client.del(`customers:${userId}`);
    await client.del(`customer:${userId}:${customerId}`);

    return apiResponse(res, 200, true, 'Customer updated successfully');
  } catch (err) {
    logger.error(`Failed to update customer (${customerId}):`, err);
    return apiResponse(res, 500, false, 'Failed to update customer');
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  const { customerId } = req.params;
  const userId = req.user_id;

  try {
    const deleted = await Customer.destroy({ where: { _id: customerId, user_id: userId } });
    if (!deleted) return apiResponse(res, 404, false, 'Customer not found');

    await connectRedis();
    await client.del(`customers:${userId}`);
    await client.del(`customer:${userId}:${customerId}`);

    return apiResponse(res, 200, true, 'Customer deleted successfully');
  } catch (err) {
    logger.error(`Failed to delete customer (${customerId}):`, err);
    return apiResponse(res, 500, false, 'Failed to delete customer');
  }
};
