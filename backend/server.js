import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { initDb, db } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "learts_secret_jwt_key_2026";

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/uploads", express.static(uploadsDir));

// Initialize Database
await initDb();

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is missing",
      data: null,
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token is invalid or expired",
        data: null,
      });
    }
    req.user = user;
    next();
  });
}

// -------------------------------------------------------------
// MODULE 1: AUTHENTICATION APIs
// -------------------------------------------------------------

// POST /api/auth/register - Register new admin or customer
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required fields",
        data: null,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        data: null,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
        data: null,
      });
    }

    const users = db.getUsers();
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "customer",
    };
    users.push(newUser);
    db.saveUsers(users);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { userId: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("Register API error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register user",
      data: null,
    });
  }
});

// POST /api/auth/login - Login admin or customer
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required fields",
        data: null,
      });
    }

    const users = db.getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      message: "Authentication successful",
      data: { token, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login API error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Authentication failed",
      data: null,
    });
  }
});

// -------------------------------------------------------------
// MODULE 2: PRODUCT & CATEGORY APIs
// -------------------------------------------------------------

// POST /api/upload - Admin Upload Image (Base64)
app.post("/api/upload", authenticateToken, (req, res) => {
  try {
    const { filename, base64Data } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({
        success: false,
        message: "Filename and base64Data are required",
        data: null,
      });
    }

    const ext = path.extname(filename).toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: "Only image files (PNG, JPG, JPEG, GIF, WEBP, SVG) are allowed",
        data: null,
      });
    }

    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // Save base64 to file
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: `/api/uploads/${uniqueFilename}`,
      },
    });
  } catch (error) {
    console.error("Upload API error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image",
      data: null,
    });
  }
});

// GET /api/categories - Public
app.get("/api/categories", (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve categories",
      data: null,
    });
  }
});

// GET /api/products - Public
app.get("/api/products", (req, res) => {
  try {
    const { categoryId, category, page, limit } = req.query;
    let products = db.getProducts();

    // Filter by category
    if (categoryId) {
      products = products.filter((p) => p.category === categoryId);
    } else if (category) {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Pagination
    if (page && limit) {
      const p = parseInt(page, 10);
      const l = parseInt(limit, 10);
      const startIndex = (p - 1) * l;
      products = products.slice(startIndex, startIndex + l);
    }

    res.json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve products",
      data: null,
    });
  }
});

// GET /api/products/:id - Public
app.get("/api/products/:id", (req, res) => {
  try {
    const products = db.getProducts();
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }
    res.json({
      success: true,
      message: "Product details retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get product details error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve product details",
      data: null,
    });
  }
});

// POST /api/products - Admin
app.post("/api/products", authenticateToken, (req, res) => {
  try {
    const { title, description, price, priceDisplay, image, hoverImage, category, stock, oldPrice, sku, brand, images, sizes, colors, badges, isFeatured } = req.body;

    // Strict Validations
    if (!title || price === undefined || !image || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, price, image link, category and stock level are required fields",
        data: null,
      });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
        data: null,
      });
    }

    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock level must be a non-negative integer",
        data: null,
      });
    }

    const products = db.getProducts();
    const newProduct = {
      id: `prod-${Date.now()}`,
      title,
      description: description || "",
      price: priceNum,
      priceDisplay: priceDisplay || `$${priceNum.toFixed(2)}`,
      image,
      hoverImage: hoverImage || image,
      category,
      stock: stockNum,
      oldPrice: oldPrice || undefined,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      brand: brand || "Learts",
      images: images || [image],
      sizes: sizes || [],
      colors: colors || [],
      badges: badges || [],
      isFeatured: isFeatured !== undefined ? isFeatured : true,
    };

    products.push(newProduct);
    db.saveProducts(products);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
      data: null,
    });
  }
});

// PUT /api/products/:id - Admin
app.put("/api/products/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const products = db.getProducts();
    const idx = products.findIndex((p) => p.id === id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    const existingProduct = products[idx];
    const { title, description, price, priceDisplay, image, hoverImage, category, stock, oldPrice, sku, brand, images, sizes, colors, badges, isFeatured } = req.body;

    // Strict Validations
    let priceNum = existingProduct.price;
    if (price !== undefined) {
      priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid positive number",
          data: null,
        });
      }
    }

    let stockNum = existingProduct.stock;
    if (stock !== undefined) {
      stockNum = parseInt(stock, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock level must be a non-negative integer",
          data: null,
        });
      }
    }

    const updatedProduct = {
      ...existingProduct,
      title: title !== undefined ? title : existingProduct.title,
      description: description !== undefined ? description : existingProduct.description,
      price: priceNum,
      priceDisplay: priceDisplay !== undefined ? priceDisplay : (price !== undefined ? `$${priceNum.toFixed(2)}` : existingProduct.priceDisplay),
      image: image !== undefined ? image : existingProduct.image,
      hoverImage: hoverImage !== undefined ? hoverImage : existingProduct.hoverImage,
      category: category !== undefined ? category : existingProduct.category,
      stock: stockNum,
      oldPrice: oldPrice !== undefined ? oldPrice : existingProduct.oldPrice,
      sku: sku !== undefined ? sku : existingProduct.sku,
      brand: brand !== undefined ? brand : existingProduct.brand,
      images: images !== undefined ? images : existingProduct.images,
      sizes: sizes !== undefined ? sizes : existingProduct.sizes,
      colors: colors !== undefined ? colors : existingProduct.colors,
      badges: badges !== undefined ? badges : existingProduct.badges,
      isFeatured: isFeatured !== undefined ? isFeatured : existingProduct.isFeatured,
    };

    products[idx] = updatedProduct;
    db.saveProducts(products);

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
      data: null,
    });
  }
});

// DELETE /api/products/:id - Admin
app.delete("/api/products/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const products = db.getProducts();
    const idx = products.findIndex((p) => p.id === id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
      });
    }

    products.splice(idx, 1);
    db.saveProducts(products);

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
      data: null,
    });
  }
});

// -------------------------------------------------------------
// MODULE 3: ORDER PROCESSING APIs
// -------------------------------------------------------------

// POST /api/orders - Submit Order (Public Client)
app.post("/api/orders", (req, res) => {
  try {
    const { firstName, lastName, address, town, email, phone, items = [] } = req.body;

    // Strict Validations
    if (!firstName || !lastName || !address || !town || !email || !phone || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing billing details or order products list",
        data: null,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email address format is invalid",
        data: null,
      });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be digits only and exactly 10 characters long",
        data: null,
      });
    }

    const products = db.getProducts();

    // Verify stock availability
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.id} not found`,
          data: null,
        });
      }

      const requestedQty = parseInt(item.quantity, 10);
      if (isNaN(requestedQty) || requestedQty <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid order quantity for product ${product.title}`,
          data: null,
        });
      }

      if (product.stock < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock level for ${product.title}. Stock: ${product.stock}, Requested: ${requestedQty}`,
          data: null,
        });
      }
    }

    // Deduct stock levels in DB
    for (const item of items) {
      const idx = products.findIndex((p) => p.id === item.id);
      const requestedQty = parseInt(item.quantity, 10);
      products[idx].stock -= requestedQty;
    }
    db.saveProducts(products);

    // Compute subtotal and record order
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      const requestedQty = parseInt(item.quantity, 10);
      return {
        id: item.id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: requestedQty,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const orders = db.getOrders();
    const newOrder = {
      id: `ord-${Date.now()}`,
      customer: {
        firstName,
        lastName,
        address,
        town,
        email,
        phone,
      },
      items: orderItems,
      total: subtotal,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    db.saveOrders(orders);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process order",
      data: null,
    });
  }
});

// GET /api/orders - Admin (newest first)
app.get("/api/orders", authenticateToken, (req, res) => {
  try {
    const orders = db.getOrders();
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({
      success: true,
      message: "Orders retrieved successfully",
      data: sortedOrders,
    });
  } catch (error) {
    console.error("Get orders list error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve orders",
      data: null,
    });
  }
});

// PUT /api/orders/:id/status - Admin Update status
app.put("/api/orders/:id/status", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status value is required",
        data: null,
      });
    }

    const validStatuses = ["Pending", "Processing", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        data: null,
      });
    }

    const orders = db.getOrders();
    const idx = orders.findIndex((o) => o.id === id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    orders[idx].status = status;
    db.saveOrders(orders);

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: orders[idx],
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
      data: null,
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Learts Backend API Server is running on http://localhost:${PORT}`);
});
