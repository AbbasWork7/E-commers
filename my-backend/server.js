const express = require('express');
const mysql = require('mysql2');
const cors = require("cors");
const twilio = require("twilio");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcrypt');

const port = 5004;

// Middleware
app.use(cors());
app.use(express.json());
require('dotenv').config();

// MySQL Connection using Promises
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123123@Abbas',
  database: 'pocketangaadi'
}).promise(); // Enables promise queries

// Test connection
(async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Connected to MySQL database.");
  } catch (err) {
    console.error("❌ Error connecting to MySQL:", err);
  }
})();

export default db;




const twilioClient = twilio("AC3e904a5d2cf4caa550e5a65542b31fa2", "2ff5c222f43a7827df0c2e50e0908b57"); // Replace with Twilio credentials
const twilioPhoneNumber = +917094428078;



// Fetch all orders
app.get("/api/v3/orders", async (req, res) => {
  const query = `
    SELECT 
      o.order_id,
      o.customer_name,
      o.total_amount,
      o.status,
      o.created_at AS order_date,
      ANY_VALUE(pt.payment_method) AS payment_method,
      COUNT(oi.order_item_id) AS items
    FROM orders o
    LEFT JOIN payment_transactions pt ON o.order_id = pt.order_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.deleted_at IS NULL
    GROUP BY o.order_id, o.customer_name, o.total_amount, o.status, o.created_at;
  `;

  try {
    const [result] = await db.query(query);
    res.json(result);
  } catch (err) {
    console.error("Error retrieving orders:", err.message);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Fetch recent orders
app.get("/api/recent-orders", async (req, res) => {
  const query = "SELECT order_id, customer_name, status, grand_total FROM orders ORDER BY created_at DESC LIMIT 3";

  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching recent orders:", err);
    res.status(500).json({ error: "Database query error" });
  }
});

// Fetch order by ID
app.get("/api/v3/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const query = "SELECT * FROM orders WHERE order_id = ?";

  try {
    const [results] = await db.query(query, [orderId]);
    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Dashboard metrics
app.get("/api/dashboard-metrics", async (req, res) => {
  const { period } = req.query;
  let dateFilter = "";

  if (period === "today") {
    dateFilter = "WHERE created_at >= CURDATE()";
  } else if (period === "week") {
    dateFilter = "WHERE created_at >= CURDATE() - INTERVAL 7 DAY";
  } else if (period === "month") {
    dateFilter = "WHERE created_at >= CURDATE() - INTERVAL 30 DAY";
  }

  try {
    const [[totalSalesResult]] = await db.query(`SELECT SUM(grand_total) AS total_sales FROM orders ${dateFilter}`);
    const totalSales = Number(totalSalesResult?.total_sales) || 0;

    const [[totalOrdersResult]] = await db.query(`SELECT COUNT(*) AS total_orders FROM orders ${dateFilter}`);
    const totalOrders = totalOrdersResult?.total_orders || 0;

    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const conversionRate = ((totalOrders / 1000) * 100).toFixed(2) + "%"; // Placeholder logic

    res.json({
      totalSales: `₹${totalSales.toFixed(2)}`,
      totalOrders,
      avgOrderValue: `₹${avgOrderValue.toFixed(2)}`,
      conversionRate,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/sales-data', async (req, res) => {
  const { period } = req.query;
  let intervalDays = period === "month" ? 30 : period === "week" ? 7 : 1;

  try {
    const [results] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date, 
              SUM(grand_total) AS sales 
       FROM orders 
       WHERE created_at >= CURDATE() - INTERVAL ? DAY
       GROUP BY date
       ORDER BY date ASC`,
      [intervalDays]
    );

    res.json(results);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

const moment = require("moment");

// Inside your route to update the status:
app.put("/api/v3/orders/update-status", async (req, res) => {
  const { orderId, status } = req.body;
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss"); // Current time in the correct format
  
  let query = "UPDATE orders SET status = ?, updated_at = ?";
  const values = [status, currentTime];

  // Conditionally handle timestamps for specific statuses
  if (status === "accepted") {
    query += ", accepted_at = ?";
    values.push(currentTime);
  } else if (status === "shipped") {
    query += ", shipped_at = ?";
    values.push(currentTime);
  } else if (status === "delivered") {
    query += ", delivered_at = ?";
    values.push(currentTime);
  }

  query += " WHERE order_id = ?";
  values.push(orderId);

  try {
    await db.query(query, values);
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: err.message });
  }
});



// GET /api/v3/orders/:orderId/activity
app.get("/api/v3/orders/:orderId/activity", async (req, res) => {
  const { orderId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT created_at, accepted_at, shipped_at, delivered_at FROM orders WHERE order_id = ?",
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = rows[0];
    const activity = [];

    if (order.created_at) {
      activity.push({
        action: "📦 Order Placed",
        changed_by: "System",
        time: order.created_at,
        automated: true,
      });
    }

    if (order.accepted_at) {
      activity.push({
        action: "📦 Order Confirmed",
        changed_by: "Admin",
        time: order.accepted_at,
        automated: false,
      });
    }

    if (order.shipped_at) {
      activity.push({
        action: "📤 Shipped via BlueDart",
        changed_by: "Logistics",
        time: order.shipped_at,
        automated: false,
      });
    }

    if (order.delivered_at) {
      activity.push({
        action: "📬 Delivered",
        changed_by: "Courier",
        time: order.delivered_at,
        automated: false,
      });
    }

    res.json(activity);
  } catch (err) {
    console.error("Error fetching activity:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch order details with activity history
app.get("/api/order/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const [orderResults] = await db.query(`SELECT * FROM orders WHERE order_id = ?;`, [orderId]);
    const [activityResults] = await db.query(
      `SELECT osh.*, u.name AS changed_by 
       FROM order_status_history osh
       LEFT JOIN users u ON osh.changed_by = u.user_id
       WHERE osh.order_id = ?
       ORDER BY osh.created_at DESC;`, 
      [orderId]
    );

    if (orderResults.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderData = orderResults[0];
    orderData.activity = activityResults; // Attach activity history

    res.json(orderData);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/api/analytics", async (req, res) => {
  try {
    const { dateRange } = req.query; // Get date range from request parameters

    let dateCondition = "";
    let prevDateCondition = ""; // For previous period comparison

    if (dateRange === "week") {
      dateCondition = "AND created_at >= NOW() - INTERVAL 7 DAY";
      prevDateCondition = "AND created_at >= NOW() - INTERVAL 14 DAY AND created_at < NOW() - INTERVAL 7 DAY";
    } else if (dateRange === "month") {
      dateCondition = "AND created_at >= NOW() - INTERVAL 1 MONTH";
      prevDateCondition = "AND created_at >= NOW() - INTERVAL 2 MONTH AND created_at < NOW() - INTERVAL 1 MONTH";
    } else if (dateRange === "year") {
      dateCondition = "AND created_at >= NOW() - INTERVAL 1 YEAR";
      prevDateCondition = "AND created_at >= NOW() - INTERVAL 2 YEAR AND created_at < NOW() - INTERVAL 1 YEAR";
    }

    // Query for current total revenue
    const [[totalRevenueResult]] = await db.query(
      `SELECT SUM(grand_total) AS total FROM orders WHERE 1 ${dateCondition}`
    );
    const totalRevenue = totalRevenueResult.total || 0;

    // Query for previous period revenue
    const [[prevTotalRevenueResult]] = await db.query(
      `SELECT SUM(grand_total) AS total FROM orders WHERE 1 ${prevDateCondition}`
    );
    const prevTotalRevenue = prevTotalRevenueResult.total || 0;

    // Query for total orders
    const [[totalOrdersResult]] = await db.query(
      `SELECT COUNT(*) AS totalOrders FROM orders WHERE 1 ${dateCondition}`
    );
    const totalOrders = totalOrdersResult.totalOrders || 0;

    // Query for previous total orders
    const [[prevTotalOrdersResult]] = await db.query(
      `SELECT COUNT(*) AS totalOrders FROM orders WHERE 1 ${prevDateCondition}`
    );
    const prevTotalOrders = prevTotalOrdersResult.totalOrders || 0;

    // Query for revenue overview (monthly revenue and orders)
    const [revenueOverview] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%b') AS month, 
        SUM(grand_total) AS revenue, 
        COUNT(*) AS orders
      FROM orders
      WHERE created_at >= NOW() - INTERVAL 1 YEAR
      GROUP BY month
      ORDER BY MIN(created_at)
    `);

    // Calculate percentage change (avoid division by zero)
    const revenueChange =
      prevTotalRevenue > 0
        ? (((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100).toFixed(2)
        : totalRevenue > 0
        ? "100%"
        : "0%";

    const ordersChange =
      prevTotalOrders > 0
        ? (((totalOrders - prevTotalOrders) / prevTotalOrders) * 100).toFixed(2)
        : totalOrders > 0
        ? "100%"
        : "0%";

    res.json({
      totalRevenue,
      prevTotalRevenue, // Send previous revenue for debugging
      revenueChange, // Send revenue percentage change
      totalOrders,
      prevTotalOrders, // Send previous orders for debugging
      ordersChange, // Send orders percentage change
      revenueOverview,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//otps
// Generate and send OTP
app.post("/api/otp/send-otp", async (req, res) => {
  const { phone_number } = req.body;
  console.log("Received request to send OTP...");

  if (!phone_number) {
    console.log("Phone number is missing!");
    return res.status(400).json({ message: "Phone number is required" });
  }

  const otp_code = crypto.randomInt(100000, 999999).toString();
  console.log("Generated OTP:", otp_code);

  db.query(
    "INSERT INTO otps (phone_number, otp_code, created_at) VALUES (?, ?, NOW())",
    [phone_number, otp_code],
    async (err) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      console.log("OTP stored in database, now sending SMS...");

      try {
        const message = await twilioClient.messages.create({
            body: `Your OTP code is: ${otp_code}`,
            from: +917094428078,  // Ensure this number is correct
            to: phone_number,          // Ensure it's in E.164 format (+919876543210)
        });
    
        console.log("✅ OTP sent successfully. Message SID:", message.sid);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("❌ Twilio Error:", error);
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
    
    }
  );
});


// Verify OTP
app.post("/api/otp/verify-otp", (req, res) => {
  const { phone_number, otp_code } = req.body;
  if (!phone_number || !otp_code) return res.status(400).json({ message: "Phone number and OTP are required" });

  db.query(
    "SELECT * FROM otps WHERE phone_number = ? AND otp_code = ? AND created_at >= NOW() - INTERVAL 5 MINUTE",
    [phone_number, otp_code],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length === 0) return res.status(400).json({ message: "Invalid or expired OTP" });
      
      res.json({ message: "OTP verified successfully", token: "dummy-jwt-token" });
    }
  );
});


// products below 
app.get('/api/products', async (req, res) => {
  try {
      const [products] = await db.query('SELECT *FROM product');
      res.json(products);
  } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});




// Delete product by ID
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await db.query('DELETE FROM product WHERE id = ?', [id]);
      res.json({ message: 'Product deleted successfully' });
  } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});




const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Create this folder if it doesn't exist
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:5004/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.post('/api/products', async (req, res) => {
  const {
    name,
    category,
    tags,
    shortDescription,
    fullDescription,
    images,
    price,
    discountedPrice,
    trackInventory,
    quantity,
    sku,
    variants,
    seo
  } = req.body;

  let parsedSeo = { title: '', description: '', keywords: '' };
  console.log(name,
    category,
    tags,
    shortDescription,
    fullDescription,
    images,
    price,
    discountedPrice,
    trackInventory,
    quantity,
    sku,
    variants,
    seo);
  try {
    if (typeof seo === 'string') {
      parsedSeo = JSON.parse(seo);
    } else if (typeof seo === 'object' && seo !== null) {
      parsedSeo = seo;
    }
  } catch (err) {
    console.error('Invalid SEO JSON:', err);
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO product (
        name, category, tags, short_description, full_description,
        images, regular_price, sale_price, track_inventory, quantity,
        sku, variants, seo_title, seo_description, seo_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        JSON.stringify(tags || []),
        shortDescription,
        fullDescription,
        JSON.stringify(images || []),
        price,
        discountedPrice,
        trackInventory,
        quantity,
        sku,
        JSON.stringify(variants || []),
        parsedSeo.title,
        parsedSeo.description,
        parsedSeo.keywords
      ]
    );

    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  } catch (error) {
    console.error('Error inserting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/log', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', username);

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const [userResult] = await db.query(
      `SELECT * FROM users WHERE username = ? OR email = ?`,
      [username, username]
    );

    if (userResult.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = userResult[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // ✅ Log user_id in terminal
    console.log('Login successful for user_id:', user.user_id);

    const userWithoutPassword = {
      user_id: user.user_id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      roles: user.roles,
      status: user.status,
      profile_picture: user.profile_picture,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json({ success: true, user: userWithoutPassword });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});





app.get('/api/pro', async (req, res) => {
  const query = `
    SELECT 
      id, 
      name, 
      regular_price AS price, 
      short_description AS description, 
      JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')) AS image 
    FROM product
  `;

  try {
    console.log("Fetching products...");
    const [results] = await db.query(query);  // await used here
    res.json(results);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: err.message });
  }
});









// 1. For profile pictures
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const uploadProfile = multer({ storage: profileStorage });


app.post('/api/sig', uploadProfile.single('profile_picture'), async (req, res) => {
  try {
    const { username, name, email, phone_number, password, role, address } = req.body;
    const profile_picture = req.file ? req.file.filename : null;

    if (!username || !name || !email || !phone_number || !password || !role || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(`
      INSERT INTO users 
      (username, name, email, phone_number, roles, status, profile_picture, auth_provider, password, created_at, updated_at, address) 
      VALUES (?, ?, ?, ?, ?, 'active', ?, 'local', ?, NOW(), NOW(), ?)
    `, [username, name, email, phone_number, role, profile_picture, hashedPassword, address]);

    res.json({ success: true });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Fetch products filtered by category
app.get('/api/productscategory/:category', async (req, res) => {
  const { category } = req.params;
  console.log('Received request for category:', category);

  const query = 'SELECT * FROM product WHERE LOWER(category) = LOWER(?)';
  console.log('Query:', query, 'Parameters:', [category]);

  try {
    const [results] = await db.query(query, [category]);
    
    if (results.length === 0) {
      console.log('No products found for category:', category);
    } else {
      console.log('Query results:', results); // Log results for debugging
    }

    res.json(results);
  } catch (err) {
    console.error('Error occurred while querying the database:', err);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});



app.post('/api/ord', async (req, res) => {
  try {
    const {
      user_id,  // Ensure user_id is received from the frontend
      business_id,
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
      gst_percent,
      discount,
      status,
      delivery_address,
      grand_total,
      items
    } = req.body;

    // Insert into orders table
    const [orderResult] = await db.execute(`
      INSERT INTO orders (
        user_id, business_id, customer_name, customer_email, customer_phone,
        total_amount, gst_percent, discount, status,
        delivery_address, grand_total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user_id,  // Add user_id here
      business_id,
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
      gst_percent,
      discount,
      status,
      delivery_address,
      grand_total
    ]);

    const orderId = orderResult.insertId;

    // OPTIONAL: Insert into order_items table if you have one
    for (const item of items) {
      await db.execute(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [
        orderId,
        item.id,
        item.quantity,
        item.price || item.sale_price
      ]);
    }

    res.status(201).json({ message: 'Order created', orderId });
  } catch (err) {
    console.error('Order insert failed:', err);
    res.status(500).json({ error: 'Order creation failed' });
  }
});



// GET /api/v3/ord/:orderId
app.get("/api/v3/ord/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
console.log(orderId);
  const query = `
    SELECT 
      oi.order_item_id,
      oi.order_id,
      oi.product_id,
      oi.quantity,
      oi.price,
      p.name AS product_name,
      JSON_UNQUOTE(JSON_EXTRACT(p.images, '$[0]')) AS image
    FROM 
      order_items oi
    JOIN 
      product p ON oi.product_id = p.id
    WHERE 
      oi.order_id = ?
  `;

  try {
    const [rows] = await db.execute(query, [orderId]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching order items:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.phone_number AS mobile,
        u.address AS city,
        COUNT(o.order_id) AS totalOrders
      FROM users u
      LEFT JOIN orders o ON u.user_id = o.user_id AND o.deleted_at IS NULL
      WHERE u.roles = 'customer' AND u.deleted_at IS NULL
      GROUP BY u.user_id, u.name, u.email, u.phone_number, u.address
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




// GET user details by user_id
app.get('/api/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user by user_id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//order page user table 
// Get all orders for a specific user
// GET all orders with their items and product images for a specific user
app.get('/api/orders/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Step 1: Fetch all orders for this user
    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // Step 2: For each order, fetch the items and their product info
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.execute(
          `SELECT oi.*, p.name AS product_name, p.images AS product_images
FROM order_items oi
JOIN product p ON oi.product_id = p.id
WHERE oi.order_id = ?
`,
          [order.order_id]
        );

        // Step 3: Parse product images safely
        const parsedItems = items.map((item) => {
          let images = [];

          if (item.product_images) {
            try {
              const parsed = JSON.parse(item.product_images);
              images = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {
              images = [item.product_images]; // fallback if not JSON
            }
          }

          return {
            ...item,
            images: images,
            image: images[0] || null, // first image for preview
          };
        });

        return {
          ...order,
          items: parsedItems,
        };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching user orders with items:', error);
    res.status(500).json({ error: 'Failed to fetch orders with items' });
  }
});

// Get recent orders
app.get('/recent-orders', async (req, res) => {
  const userId = req.user.id; // assuming user ID is available in the request (from authentication)
  
  try {
    const query = `
      SELECT o.order_id, o.created_at, oi.product_id, p.name AS product_name, o.status, o.total_amount
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN product p ON oi.product_id = p.id
      WHERE o.user_id = ? AND o.deleted_at IS NULL
      ORDER BY o.created_at DESC
      LIMIT 2;`;

    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.get('/api/pr/:id', async (req, res) => {
  const productId = req.params.id;

  const query = `
    SELECT 
      id, 
      name, 
      category, 
      tags, 
      short_description AS description, 
      full_description, 
      images, 
      regular_price AS price, 
      sale_price, 
      track_inventory, 
      quantity, 
      sku, 
      variants, 
      seo_title, 
      seo_description, 
      seo_keywords 
    FROM product
    WHERE id = ?  -- Ensure we filter by product ID
  `;

  try {
    console.log("Fetching product details...");
    const [results] = await db.query(query, [productId]);  // Awaiting the query result

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(results[0]);  // Return the first product if found
    console.log(results[0]);
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/related-products', async (req, res) => {
  const { category, excludeId } = req.query;
  try {
    const [results] = await db.query(
      `SELECT id, name, category, images, regular_price AS price FROM product WHERE category = ? AND id != ? LIMIT 4`,
      [category, excludeId]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:userId - Get orders by user ID
// Route: GET /api/orders/:userId
app.get('/api/orders/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log("hii...");

  try {
    // Fetch orders for the user
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // For each order, fetch items with product names
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await db.query(
          `SELECT 
            oi.product_id, 
            p.name AS product_name, 
            oi.quantity, 
            oi.price 
           FROM order_items oi
           JOIN product p ON oi.product_id = p.id
           WHERE oi.order_id = ?`,
          [order.order_id]
        );

        const itemNames = items.map(item => item.product_name);

        return {
          ...order,
          items: itemNames,
        };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
