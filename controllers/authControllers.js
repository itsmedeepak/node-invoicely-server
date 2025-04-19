import User from "../models/userModel.js";
import apiResponse from "../helper/apiResponse.js";
import { generateToken, comparePassword, hashPassword } from "../utils/authUtils.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { welcomeEmailTemplate } from "../static/templates/welcome.js";
import { sendEmail } from "../utils/emailUtil.js";
import Subscription from "../models/subscriptionModel.js";
import logger from "../utils/logger.js"; 

// Sign Up
export const SignUp = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return apiResponse(res, 400, false, "Email already in use");
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            userId: uuidv4(),
            firstName: first_name,
            lastName: last_name,
            email,
            phone,
            password: hashedPassword,
        });

        await Subscription.create({
            user_id: newUser.userId,
            plan: 'trial',
            valid_till: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: 'active',
            credits_used: 0,
            credits_remaining: 10,
            average_daily_usage: 0,
            last_refreshed: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        });

        const template = welcomeEmailTemplate(first_name);
        const subject = "Welcome to Invoecly!";
        await sendEmail(email, subject, template); // Await the email sending

        return apiResponse(res, 201, true, "User created successfully", {
            id: newUser._id,
            email: newUser.email,
        });

    } catch (error) {
        logger.error("SignUp error:", error);
        return apiResponse(res, 500, false, "Internal server error");
    }
};

// Log In
export const LogIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return apiResponse(res, 400, false, "Email and password are required");
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return apiResponse(res, 401, false, "Invalid email or password");

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return apiResponse(res, 401, false, "Invalid email or password");

        const { authToken, refreshToken } = generateToken(user.userId, user.email);
        await user.update({ authToken, refreshToken });

        const responseUser = {
            _id: user.userId,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone: user.phone,
            walk_through: user.walkThrough,
            auth_token: authToken,
            refresh_token: refreshToken,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        };

        return apiResponse(res, 200, true, "Login successful", responseUser);
    } catch (error) {
        logger.error("Login error:", error);
        return apiResponse(res, 500, false, "Internal server error");
    }
};

// Reset Password
export const ResetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return apiResponse(res, 400, false, "Email and new password required");
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return apiResponse(res, 404, false, "User not found");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        return apiResponse(res, 200, true, "Password reset successful");
    } catch (error) {
        logger.error("ResetPassword error:", error);
        return apiResponse(res, 500, false, "Error resetting password");
    }
};

// Send OTP Email (Mocked)
export const SendOtpEmail = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    logger.info(`Generated OTP for ${email}: ${otp}`);

    return apiResponse(res, 200, true, "OTP generation simulated", { otp });
};
