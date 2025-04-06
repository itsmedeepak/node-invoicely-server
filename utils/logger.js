

import { createLogger, transports, format } from 'winston';
import path from 'path';
import fs from 'fs';


const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}


const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
);


const logger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console(),

    ...(process.env.NODE_ENV === 'production'
      ? [
          new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
          new transports.File({ filename: path.join(logDir, 'combined.log') }),
        ]
      : []),
  ],
});

export default logger;
