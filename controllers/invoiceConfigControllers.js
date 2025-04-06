import InvoiceConfig from '../models/invoiceConfigModel.js';
import { apiResponse } from '../utils/ApiResponse.js';
import logger from '../utils/logger.js'; 
// GET Invoice Configuration
export const getInvoiceConfiguration = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'Unauthorized');

  try {
    const config = await InvoiceConfig.findOne({ where: { user_id: userId } });
    if (!config) {
      return apiResponse(res, 200, false, 'Invoice configuration not found');
    }
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
