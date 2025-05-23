import InvoiceConfig from '../models/invoiceConfigModel.js';
import apiResponse from '../helper/apiResponse.js';
import logger from '../utils/logger.js';
import { client, connectRedis } from '../cache/redis.js';

// GET Invoice Configuration
export const getInvoiceConfiguration = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'Unauthorized');

  try {
    await connectRedis();
    const cacheKey = `invoiceConfig:${userId}`;
    const cached = await client.get(cacheKey);

    if (cached) {
      logger.info(`Serving invoice config for user ${userId} from cache`);
      return apiResponse(res, 200, true, 'Invoice configuration fetched (from cache)', JSON.parse(cached));
    }

    const config = await InvoiceConfig.findOne({ where: { user_id: userId } });
    if (!config) {
      return apiResponse(res, 200, false, 'Invoice configuration not found');
    }

    await client.set(cacheKey, JSON.stringify(config), { EX: 300 }); // Cache for 5 minutes
    return apiResponse(res, 200, true, 'Invoice configuration fetched', config);
  } catch (error) {
    logger.error('Failed to fetch invoice configuration:', error);
    return apiResponse(res, 500, false, 'Failed to fetch configuration');
  }
};

// UPSERT Invoice Configuration
export const updateInvoiceConfiguration = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'Unauthorized');

  const data = req.body;

  try {
    const [existingConfig, created] = await InvoiceConfig.findOrCreate({
      where: { user_id: userId },
      defaults: {
        ...data,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    if (!created) {
      await existingConfig.update({
        ...data,
        updated_at: new Date(),
      });
    }

    await connectRedis();
    const cacheKey = `invoiceConfig:${userId}`;
    await client.set(cacheKey, JSON.stringify(existingConfig), { EX: 300 }); // Refresh cache

    return apiResponse(
      res,
      200,
      true,
      created ? 'Invoice configuration created' : 'Invoice configuration updated',
      existingConfig
    );
  } catch (error) {
    logger.error('Failed to update invoice configuration:', error);
    return apiResponse(res, 500, false, 'Failed to update configuration');
  }
};
