import {
  getProfile,
  editProfile,
  changePassword,
} from "../controllers/userControllers.js";

import { Router } from "express";

const router = Router();

router.get("/", getProfile);
router.put("/", editProfile);
router.put("/change-password", changePassword);

export default router;
