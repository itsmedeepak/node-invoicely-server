import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const DB_CONN_URL = process.env.DB_CONN_URL || '';

const sequelize = new Sequelize(DB_CONN_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  define: {
    underscored: true, 
  },
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    await sequelize.sync({ alter: true }); 
    logger.info('Database synchronized with models.');
  } catch (error) {
    logger.error(`Database connection or sync failed: ${error.message}`);
    process.exit(1); 
  }
};

connectDatabase();

export default sequelize;
