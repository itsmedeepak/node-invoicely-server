import { Router } from "express";
import {
  getInvoices,
  getInvoice,
  createInvoices,
  deleteInvoices,
} from "../controllers/invoiceControllers.js";

const router = Router();

router.get("/", getInvoices);
router.get("/:invoiceId", getInvoice);
router.post("/", createInvoices);
// router.get("/send/:invoiceId", sendInvoiceEmail);
// router.put("/:invoiceId", updateInvoices);
router.delete("/:invoiceId", deleteInvoices);

export default router;
