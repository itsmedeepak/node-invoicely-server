import { Router } from "express";
import {
  getSubscription,
  updateSubscription,
} from "../controllers/subscriptionControllers.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", AuthMiddleware, getSubscription);
router.post("/", AuthMiddleware, updateSubscription);

export default router;
