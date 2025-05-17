import express from "express";
import axios from "axios";

const router = express.Router();

// Interface for storing order data
interface OrderData {
  items: Array<{ name: string; price: number; quantity: number }>;
  amount: number;
}

// In-memory storage for order details (replace with database in production)
const orderStorage = new Map<string, OrderData>();

const clientId = process.env.CASHFREE_CLIENT_ID || "";
const clientSecret = process.env.CASHFREE_CLIENT_SECRET || "";
const env = process.env.CASHFREE_ENVIRONMENT === "SANDBOX" ? "TEST" : "PROD";

// Endpoint to initiate payment (order creation)
router.post("/initiate-payment", async (req, res) => {
  try {
    const { amount, merchantTransactionId, redirectUrl, items } = req.body;

    if (!amount || !redirectUrl) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters"
      });
    }

    const orderId = merchantTransactionId || `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Store items in memory before sending to Cashfree
    orderStorage.set(orderId, {
      items: items || [],
      amount: parseFloat(amount)
    });

    const response = await axios({
      method: 'post',
      url: env === "TEST"
        ? 'https://sandbox.cashfree.com/pg/orders'
        : 'https://api.cashfree.com/pg/orders',
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': '2022-09-01',
        'Content-Type': 'application/json'
      },
      data: {
        order_id: orderId,
        order_amount: parseFloat(amount).toFixed(2),
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_name: "Cafe Customer",
          customer_email: "customer@example.com",
          customer_phone: "9999999999"
        },
        order_meta: {
          return_url: `${redirectUrl}?order_id=${orderId}`
        },
        order_note: "Cafe order payment"
      }
    });

    res.json({
      success: true,
      orderId: orderId,
      paymentSessionId: response.data.payment_session_id
    });
  } catch (error) {
    const err = error as any;
    console.error("Cashfree payment error:", err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data?.message || "Payment initialization failed"
    });
  }
});

// Endpoint to fetch payment status
router.get("/payment-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get stored order details
    const storedOrder = orderStorage.get(orderId);
    
    // Get payment status from Cashfree
    const cfResponse = await axios({
      method: 'get',
      url: `${env === "TEST"
        ? 'https://sandbox.cashfree.com/pg/orders/'
        : 'https://api.cashfree.com/pg/orders/'}${orderId}`,
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': '2022-09-01'
      }
    });

    // Combine Cashfree data with stored items
    const responseData = {
      ...cfResponse.data,
      order_meta: {
        ...cfResponse.data.order_meta,
        items: storedOrder?.items || []
      },
      order_amount: storedOrder?.amount || cfResponse.data.order_amount
    };

    res.json({
      success: true,
      orderStatus: cfResponse.data.order_status,
      paymentDetails: responseData
    });
  } catch (error) {
    const err = error as any;
    console.error("Payment status error:", err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data?.message || "Failed to fetch payment status"
    });
  }
});

export default router;
