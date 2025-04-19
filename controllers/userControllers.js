import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import apiResponse from '../helper/apiResponse.js';
import logger from '../utils/logger.js';

// Edit Profile
export const editProfile = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'Unauthorized');

  const { firstName, lastName, phone, walkThrough } = req.body;

  if (!firstName || !lastName || !phone) {
    return apiResponse(res, 400, false, 'firstName, lastName and phone are required');
  }

  try {
    const [updated] = await User.update(
      {
        firstName,
        lastName,
        phone,
        walkThrough: walkThrough ?? false,
        updatedAt: new Date(),
      },
      { where: { userId } }
    );

    if (updated === 0) {
      logger.warn(`Profile update failed: User ${userId} not found`);
      return apiResponse(res, 404, false, 'Profile not found or not updated');
    }

    logger.info(`Profile updated successfully for user ${userId}`);
    return apiResponse(res, 200, true, 'Profile updated');
  } catch (error) {
    logger.error(`Profile update error (User ${userId}): ${error.message}`);
    return apiResponse(res, 500, false, 'Failed to update profile');
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'Unauthorized');

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      logger.warn(`Profile fetch failed: User ${userId} not found`);
      return apiResponse(res, 404, false, 'User not found');
    }

    const data = {
      userId: user.userId,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      walk_through: user.walkThrough,
      phone: user.phone,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };

    logger.info(`Profile fetched successfully for user ${userId}`);
    return apiResponse(res, 200, true, 'Profile fetched', data);
  } catch (error) {
    logger.error(`Error fetching profile (User ${userId}): ${error.message}`);
    return apiResponse(res, 500, false, 'Error fetching profile');
  }
};

// Change Password
export const changePassword = async (req, res) => {
  const userId = req.user_id;
  if (!userId) return apiResponse(res, 401, false, 'Unauthorized');

  const { current_password, new_password } = req.body;

  if (!current_password || !new_password || new_password.length < 8) {
    return apiResponse(res, 400, false, 'Invalid password input');
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      logger.warn(`Password change failed: User ${userId} not found`);
      return apiResponse(res, 404, false, 'User not found');
    }

    const match = await bcrypt.compare(current_password, user.password);
    if (!match) {
      logger.warn(`Incorrect current password for user ${userId}`);
      return apiResponse(res, 401, false, 'Incorrect old password');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await user.update({ password: hashedPassword, updatedAt: new Date() });

    logger.info(`Password updated successfully for user ${userId}`);
    return apiResponse(res, 200, true, 'Password changed successfully');
  } catch (error) {
    logger.error(`Error changing password (User ${userId}): ${error.message}`);
    return apiResponse(res, 500, false, 'Error updating password');
  }
};
