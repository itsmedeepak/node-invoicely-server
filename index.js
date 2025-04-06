// Packages imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import chalk from 'chalk';

// Routes imports
import AuthRoutes from './routes/authRoute.js';
import BillingRoutes from './routes/billingRoutes.js';
import CustomerRoutes from './routes/customerRoute.js';
import SubscriptionRoutes from './routes/subscriptionRoutes.js';
import ProductRoutes from './routes/productRoute.js';
import InvoiceRoutes from './routes/invoiceRoute.js';
import ProfileRoutes from "./routes/profileRoutes.js"
import ConfigRoutes from "./routes/configRoutes.js"

// Middlewares imports
import AuthMiddleware from './middleware/authMiddleware.js';
import errorHandler from './middleware/errorHandler.js';
import logger from "./utils/logger.js"

// Utils imports
import { apiResponse } from './utils/ApiResponse.js';

dotenv.config();

const app = express();


// Middleware
// Security
app.use(cors());
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' })); 
app.use(helmet.noSniff()); 
app.use(helmet.xssFilter()); 
app.use(bodyParser.json());

// Logger
morgan.token('user-id', (req) => req.user_id || 'guest');
app.use(morgan(':method :url :status :response-time ms - user: :user-id'));
app.use(morgan('dev'));

// Routes
app.use('/auth', AuthRoutes);
app.use('/profile', AuthMiddleware, ProfileRoutes);
app.use('/customer', AuthMiddleware, CustomerRoutes);
app.use('/product', AuthMiddleware, ProductRoutes);
app.use('/billing', AuthMiddleware, BillingRoutes);
app.use('/subscription', AuthMiddleware, SubscriptionRoutes);
app.use('/invoice', AuthMiddleware, InvoiceRoutes);
app.use('/invoice-config', AuthMiddleware, ConfigRoutes)


// 404 handler
app.use('*', (req, res) => {
  return apiResponse({
    res,
    status: 'error',
    succes:false,
    message: 'API route not found',
  });
});

// Error handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  console.log(chalk.green.bold(`🚀 Server running on http://localhost:${PORT}`));
});



export default app;