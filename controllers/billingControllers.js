import Billing from "../models/billingModel.js";
import apiResponse from "../helper/apiResponse.js";
import logger from '../utils/logger.js'; 
import { client, connectRedis } from "../cache/redis.js";

// Get billing details
export const getBilling = async (req, res) => {
  const userId = req.user_id;

  if (!userId) {
    return apiResponse(res, 401, false, "Unauthorized", null);
  }

  try {
    await connectRedis(); // ensure Redis is connected

    const cacheKey = `billing:${userId}`;
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      logger.info(`Serving billing data for user ${userId} from cache`);
      return apiResponse(res, 200, true, "Billing details fetched (from cache)", JSON.parse(cachedData));
    }

    const billing = await Billing.findOne({ where: { user_id: userId } });

    if (!billing) {
      return apiResponse(res, 200, false, "Billing details not found", null);
    }

    await client.set(cacheKey, JSON.stringify(billing), {
      EX: 300, // expire in 5 minutes (adjust as needed)
    });

    return apiResponse(res, 200, true, "Billing details fetched", billing);
  } catch (error) {
    logger.error(`Failed to fetch billing for user ${userId}:`, error);
    return apiResponse(res, 500, false, "Internal server error", null);
  }
};

// Upsert billing details
export const updateBilling = async (req, res) => {
  const userId = req.user_id;

  if (!userId) {
    return apiResponse(res, 401, false, "Unauthorized", null);
  }

  const billingData = req.body;

  try {
    const dataToUpsert = { ...billingData, user_id: userId };

    const [billing, created] = await Billing.upsert(dataToUpsert);

    const cacheKey = `billing:${userId}`;
    await connectRedis();
    await client.set(cacheKey, JSON.stringify(billing), {
      EX: 300, // optionally cache updated data again
    });

    const message = created ? "Billing details created" : "Billing details updated";
    return apiResponse(res, 200, true, message, billing);
  } catch (error) {
    logger.error(`Failed to update billing for user ${userId}:`, error);
    return apiResponse(res, 500, false, "Failed to update billing details", null);
  }
};
