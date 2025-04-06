import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import dotenv from 'dotenv';
import logger from './logger.js'; // ✅ use centralized logging

dotenv.config();

const REGION = process.env.AWS_REGION;
const SENDER_EMAIL = process.env.AWS_AUTH_EMAIL;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

/**
 * Send an email using AWS SES
 * @param {string} toEmail - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} htmlBody - HTML content of the email
 * @returns {Promise<object>} - SES response
 */
export const sendEmail = async (toEmail, subject, htmlBody) => {
  const params = {
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        Text: {
          Data: 'This email requires HTML support to view properly.',
          Charset: 'UTF-8',
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);

    logger.info(`✅ Email sent to ${toEmail} - Message ID: ${result.MessageId}`);
    return result;
  } catch (error) {
    logger.error(`❌ Email sending failed to ${toEmail} - ${error.message}`);
    throw new Error('Failed to send email. Please try again later.');
  }
};
