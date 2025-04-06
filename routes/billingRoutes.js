

import express from "express";
import { getBilling, updateBilling } from "../controllers/billingControllers.js";

const router = express.Router();

router.get("/", getBilling)
router.post("/", updateBilling)


export default router;
