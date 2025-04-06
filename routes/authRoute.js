import express from "express";
import {SignUp, LogIn, ResetPassword, SendOtpEmail} from "../controllers/authControllers.js"
const router = express.Router();

router.post("/sign-up", SignUp)
router.post("/sign-in",  LogIn)
router.post("/forgot-password",  ResetPassword)
router.post("/send-otp", SendOtpEmail)


export default router;