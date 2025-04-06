import { Invoice, LineItem, Customer } from "../models/invoiceModel.js";
import InvoiceConfiguration from "../models/invoiceConfigModel.js"
import { apiResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";
import { sendEmail } from "../utils/emailUtil.js";
import {invoiceTemplate} from "../static/templates/invoice.js"
export const getInvoices = async (req, res) => {
	const userId = req.user_id;
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: Customer,
          as: 'InvoiceCustomer',
        },
        {
          model: LineItem,
          attributes: {
            exclude: ['id', 'invoice_id'],
          },
        },
      ],
	  where:{user_id:userId}
    });
	
    const formatted = invoices.map((invoice) => ({
      user_id: invoice.user_id,
      invoice_id: invoice.invoice_id,
      invoice_no: invoice.invoice_no,
      invoice_url: invoice.invoice_url || '',
      invoice_logo: invoice.invoice_logo || '',
      issued_date: invoice.issued_date,
      due_date: invoice.due_date,
      customer: {
        _id: invoice.InvoiceCustomer?.customer_id || null,
        user_id: invoice.InvoiceCustomer?.user_id || null,
        email: invoice.InvoiceCustomer?.email || '',
        phone: invoice.InvoiceCustomer?.phone || '',
        street_address: invoice.InvoiceCustomer?.street_address || '',
        city: invoice.InvoiceCustomer?.city || '',
        state: invoice.InvoiceCustomer?.state || '',
        country: invoice.InvoiceCustomer?.country || '',
        first_name: invoice.InvoiceCustomer?.first_name || '',
        last_name: invoice.InvoiceCustomer?.last_name || '',
        created_at: invoice.InvoiceCustomer?.createdAt || '',
        updated_at: invoice.InvoiceCustomer?.updatedAt || '',
      },
      customer_id: invoice.customer_id,
      products: invoice.LineItems.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        currency: item.currency,
        final_price: item.final_price,
        total_price: item.total_price,
      })),
      payment_method: invoice.payment_method,
      payment_status: invoice.payment_status,
      invoice_generated_by: invoice.invoice_generated_by,
      total_amount: invoice.total_amount,
      currency: invoice.currency,
      url: invoice.url || '',
      created_at: invoice.created_at || '',
      updated_at: invoice.updated_at || '',
    }));
	
    return res.status(200).json({
      success: true,
      message: 'Invoices fetched successfully',
      data: formatted,
    });
  } catch (error) {
    logger.error('Error fetching invoices:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message,
    });
  }
};

export const getInvoice = async (req, res) => {
  const userId = req.user_id;
  const { invoiceId } = req.params;

  try {
    const invoice = await Invoice.findOne({
      where: { user_id: userId, _id: invoiceId },
      include: [
        { model: Customer, as: "customer" },
        { model: LineItem, as: "products" }
      ]
    });

    if (!invoice) {
      return apiResponse(res, 404, false, "Invoice not found");
    }

    return apiResponse(res, 200, true, "Invoice fetched", invoice);
  } catch (err) {
    logger.error("Error while fetching invoice:", err);
    return apiResponse(res, 500, false, "Error while fetching invoice");
  }
};

export const createInvoices = async (req, res) => {
  const userId = req.user_id;
  const {
    invoice_id,
    issued_date,
    due_date,
    customer,
    invoice_no,
    invoice_url,
    logo_url,
    products,
    payment_method,
    payment_status,
    invoice_generated_by,
    total_amount,
    currency
  } = req.body;

  logger.info("Create Invoice Request Body:", req.body);

  try {
    const [customerRecord] = await Customer.findOrCreate({
      where: { customer_id: customer._id },
      defaults: {
        customer_id: customer.customer_id,
        user_id: userId,
        email: customer.email,
        phone: customer.phone,
        street_address: customer.street_address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        first_name: customer.first_name,
        last_name: customer.last_name
      }
    });

    const invoice = await Invoice.create({
      user_id: userId,
      issued_date,
      due_date,
      customer_id: customerRecord.customer_id,
      invoice_no,
      invoice_url,
      logo_url,
      payment_method,
      payment_status,
      invoice_generated_by,
      total_amount,
      currency
    });

    const lineItems = await Promise.all(
      products.map((product) =>
        LineItem.create({
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          discount: product.discount,
          final_price: product.final_price,
          total_price: product.total_price,
          currency: product.currency,
          invoice_id: invoice._id
        })
      )
    );

	const company = await InvoiceConfiguration.findOne({ user_id: userId });
	
	
	const invoiceData = {
	  invoice_id: invoice_no,
	  issued_date: issued_date,
	  due_date: due_date,
	  currency: currency,
	  total_amount: total_amount,
	  payment_method: payment_method,
	  payment_status: payment_status,
	  customer: customer,
	  products: products
	};
	
	const template = invoiceTemplate({ company, invoice: invoiceData });
	const subject = `Invoice #${invoiceData.invoice_id} from ${company.name}`;
	await sendEmail(customer?.email, subject, template);
	
    return apiResponse(res, 201, true, "Invoice with customer created", {
      invoice,
      products: lineItems
    });
  } catch (err) {
	console.log(err)
    logger.error("Error while creating invoice:", err);
    return apiResponse(res, 500, false, "Error while creating invoice");
  }
};

export const deleteInvoices = async (req, res) => {
	const userId = req.user_id;
	const { invoiceId } = req.params;
  
	try {
	  const deleted = await Invoice.destroy({
		where: {
		  user_id: userId,
		  invoice_id: invoiceId, 
		},
	  });
  
	  if (!deleted) {
		return apiResponse(res, 404, false, "Invoice not found");
	  }
  
	  return apiResponse(res, 200, true, "Invoice deleted successfully");
	} catch (err) {
	  logger.error("Error while deleting invoice:", err);
	  console.log(err)
	  return apiResponse(res, 500, false, "Error while deleting invoice");
	}
  };
  