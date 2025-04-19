import Subscription from '../models/subscriptionModel.js';
import apiResponse from '../helper/apiResponse.js';
import logger from '../utils/logger.js';
import { client, connectRedis } from "../cache/redis.js"; // Redis cache utilities

/**
 * Get the subscription for the authenticated user
 */
export const getSubscription = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'Unauthorized');

  try {
    // Check Redis cache first
    await connectRedis();
    const cacheKey = `subscription:${userId}`;
    const cachedSubscription = await client.get(cacheKey);

    if (cachedSubscription) {
      logger.info(`Returning cached subscription for user ${userId}`);
      return apiResponse(res, 200, true, 'Subscription fetched', JSON.parse(cachedSubscription));
    }

    // If not cached, fetch from DB
    const subscription = await Subscription.findOne({ where: { user_id: userId } });

    if (!subscription) {
      logger.warn(`No subscription found for user ${userId}`);
      return apiResponse(res, 400, false, 'No subscription found');
    }

    logger.info(`Subscription fetched for user ${userId}`);

    // Cache the result for 5 minutes (300 seconds)
    await client.set(cacheKey, JSON.stringify(subscription), 'EX', 300); // Cache for 5 minutes

    return apiResponse(res, 200, true, 'Subscription fetched', subscription);
  } catch (error) {
    logger.error(`Error fetching subscription for user ${userId}: ${error.message}`);
    return apiResponse(res, 500, false, 'Failed to fetch subscription');
  }
};

/**
 * Update the subscription for the authenticated user
 */
export const updateSubscription = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'Unauthorized');

  const subInput = req.body;

  try {
    let subscription = await Subscription.findOne({ where: { user_id: userId } });

    if (!subscription) {
      // Create a trial subscription if not found
      const trialEnd = new Date();
      trialEnd.setMonth(trialEnd.getMonth() + 1);

      subscription = await Subscription.create({
        user_id: userId,
        plan: 'trial',
        valid_till: trialEnd,
        status: 'active',
        credits_used: 0,
        credits_remaining: 10,
        average_daily_usage: 0,
        last_refreshed: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      logger.info(`Trial subscription created for user ${userId}`);

      // Cache the trial subscription for 5 minutes
      await client.set(`subscription:${userId}`, JSON.stringify(subscription), 'EX', 300); // Cache for 5 minutes

      return apiResponse(res, 201, true, 'Trial subscription created', subscription);
    }

    // Update the existing subscription
    await subscription.update({
      ...subInput,
      updated_at: new Date(),
    });

    logger.info(`Subscription updated for user ${userId}`);

    // Cache the updated subscription for 5 minutes
    await client.set(`subscription:${userId}`, JSON.stringify(subscription), 'EX', 300); // Cache for 5 minutes

    return apiResponse(res, 200, true, 'Subscription updated', subscription);
  } catch (error) {
    logger.error(`Error updating subscription for user ${userId}: ${error.message}`);
    return apiResponse(res, 500, false, 'Failed to update subscription');
  }
};
