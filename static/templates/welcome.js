export const welcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 10px; text-align: center;">
        
        <h1 style="color: #333;">Welcome to Invoecly, ${name}!</h1>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We're excited to help you manage your invoices effortlessly. Get started by setting up your profile, adding your first customer, and creating your first invoice.
        </p>
        <a href="https://app-invoicely-co.vercel.app/" 
           style="display: inline-block; background: #007BFF; color: #ffffff; text-decoration: none; 
                  padding: 12px 24px; border-radius: 5px; margin-top: 20px; font-size: 16px;">
           Get Started
        </a>
        <p style="margin-top: 20px; font-size: 14px; color: #999;">
            Need help? Contact us at <a href="mailto:support@invoecly.com" style="color: #007BFF;">support@app-invoecly-co.com</a>
        </p>
    </div>
</body>
</html>
`;
