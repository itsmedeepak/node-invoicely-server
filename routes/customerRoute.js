import { Router } from 'express';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerControllers.js';

const router = Router();

router.get('/', getCustomers);
router.get('/:customerId',  getCustomer);
router.post('/',  createCustomer);
router.put('/:customerId',  updateCustomer);
router.delete('/:customerId', deleteCustomer);

export default router;
