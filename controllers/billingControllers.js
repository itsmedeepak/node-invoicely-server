import Billing from "../models/billingModel.js";
import apiResponse from "../helper/apiResponse.js";
import logger from '../utils/logger.js'; // ✅ Import logger

// Get billing details
export const getBilling = async (req, res) => {
  const userId = req.user_id;
  if (!userId) {
    return apiResponse(res, 401, false, "Unauthorized", null);
  }

  try {
    const billing = await Billing.findOne({ where: { user_id: userId } });

    if (!billing) {
      return apiResponse(res, 200, false, "Billing details not found", null);
    }

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

    const message = created ? "Billing details created" : "Billing details updated";
    return apiResponse(res, 200, true, message, billing);
  } catch (error) {
    logger.error(`Failed to update billing for user ${userId}:`, error);
    return apiResponse(res, 500, false, "Failed to update billing details", null);
  }
};
