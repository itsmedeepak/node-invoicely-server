import { Router } from "express";
import {
  getInvoiceConfiguration,
  updateInvoiceConfiguration,
} from "../controllers/invoiceConfigControllers.js";

const router = Router();


router.get("/", getInvoiceConfiguration);
router.post("/", updateInvoiceConfiguration);

export default router;