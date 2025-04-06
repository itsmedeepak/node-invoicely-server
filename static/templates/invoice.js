export const invoiceTemplate = ({ company, invoice }) => {
  
  const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Invoice Email</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="background-color: #f3f4f6; max-width: 600px; min-width:280px; margin:0 auto">
    <div style="margin: 0 auto; width: 100%; background-color: #ffffff; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 8px;">
        <table role="presentation" style="width: 100%; border: none;">
    <tr>
        <td style="width: 70%; padding-right: 10px;">
            <h4 style="font-size: 18px; font-weight: bold; color: #111827; margin: 0;">Invoicely</h4>
            <p style="color: #374151; font-size: 10px;">GURUKUL MAJHANPUR INDIRA N L SHERGHATI GAYA BIHAR</p>
            <p style="color: #374151; font-size: 10px;">Gaya, India</p>
            <p style="color: #374151; font-size: 10px;">+91 (123) 456 7891</p>
            <p style="color: #374151; font-size: 10px;">support@invoicely.com</p>
        </td>
        <td style="width: 30%; text-align: right;">
            <img src="https://cdn-1.webcatalog.io/catalog/invoicely/invoicely-icon-filled-256.webp?v=1714774770520" alt="Company Logo" style="width: 80px; height: 80px;">
        </td>
    </tr>
</table>


        <hr style="margin: 20px 0; border: 1px solid #d1d5db;">

        <div style="margin-bottom: 20px; color: #374151; font-size: 10px;">
            <p><strong>Invoice #: </strong> 45837</p>
            <p><strong>Issued:</strong> 4/6/2025</p>
            <p><strong>Due:</strong> 4/6/2025</p>
        </div>

        <div style="margin-bottom: 20px;">
            <h3 style="font-weight: bold; font-size: 12px; margin-bottom: 6px; color: #111827;">Bill To:</h3>
            <p style="color: #374151; font-size: 10px;">Deepak Kumar</p>
            <p style="color: #374151; font-size: 10px;">Mantra Manor</p>
            <p style="color: #374151; font-size: 10px;">Bhubaneswar Odisha India</p>
            <p style="color: #374151; font-size: 10px;">deep.bes.us@gmail.com</p>
            <p style="color: #374151; font-size: 10px;">8804375275</p>
        </div>

        <table style="width:98%; border-collapse: collapse; border: 1px solid #d1d5db; text-align: left; font-size: 10px;">
            <thead>
                <tr style="background-color: #e5e7eb; font-weight: bold;">
                    <th style="border: 1px solid #d1d5db; padding: 8px;">Item</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Price</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Discount (%)</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Qty</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>

                    <tr>
                        <td style="border: 1px solid #d1d5db; padding: 8px;">MUI Charger Poco-X2</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">INR 2000</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">4</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">1</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">INR 1920</td>
                    </tr>

                    <tr>
                        <td style="border: 1px solid #d1d5db; padding: 8px;">POCO-X2 XDSG56</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">INR 17999</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">3</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">1</td>
                        <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">INR 17459.03</td>
                    </tr>

            </tbody>
        </table>

        <div style="margin-top: 40px; text-align: right; color: #111827; font-size: 12px;">
            <p><strong>Payment Method:</strong> UPI Transfer</p>
            <p><strong>Payment Status:</strong> Due</p>
            <p style="font-size: 14px; font-weight: bold; margin-top: 6px;">Total: INR 19379.03</p>
        </div>
    </div>
</body>
</html>
`;
  return template;
};
