import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, "db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const USERS_FILE = path.join(dbDir, "users.json");
const PRODUCTS_FILE = path.join(dbDir, "products.json");
const CATEGORIES_FILE = path.join(dbDir, "categories.json");
const ORDERS_FILE = path.join(dbDir, "orders.json");

// Helper to read JSON file safely
function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return content.trim() ? JSON.parse(content) : fallback;
  } catch (error) {
    console.error(`Error reading database file ${filePath}:`, error);
    return fallback;
  }
}

// Helper to write JSON file atomically
function writeJsonFile(filePath, data) {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.error(`Error writing database file ${filePath}:`, error);
  }
}

export async function initDb() {
  console.log("Initializing database files...");

  // Seed Categories
  if (!fs.existsSync(CATEGORIES_FILE) || readJsonFile(CATEGORIES_FILE, []).length === 0) {
    const publicCategoriesPath = path.join(__dirname, "..", "frontend", "public", "api", "categories.json");
    if (fs.existsSync(publicCategoriesPath)) {
      const initialCategories = JSON.parse(fs.readFileSync(publicCategoriesPath, "utf-8"));
      writeJsonFile(CATEGORIES_FILE, initialCategories);
      console.log("Seeded categories from public API assets.");
    } else {
      writeJsonFile(CATEGORIES_FILE, []);
    }
  }

  // Seed Products
  if (!fs.existsSync(PRODUCTS_FILE) || readJsonFile(PRODUCTS_FILE, []).length === 0) {
    const publicProductsPath = path.join(__dirname, "..", "frontend", "public", "api", "products.json");
    if (fs.existsSync(publicProductsPath)) {
      const initialProducts = JSON.parse(fs.readFileSync(publicProductsPath, "utf-8"));
      writeJsonFile(PRODUCTS_FILE, initialProducts);
      console.log("Seeded products from public API assets.");
    } else {
      writeJsonFile(PRODUCTS_FILE, []);
    }
  }

  // Seed Users & Default Admin
  if (!fs.existsSync(USERS_FILE) || readJsonFile(USERS_FILE, []).length === 0) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const defaultAdmin = {
      id: "admin-1",
      email: "admin@learts.com",
      password: hashedPassword,
      role: "admin",
    };
    writeJsonFile(USERS_FILE, [defaultAdmin]);
    console.log("Seeded default admin user: email: admin@learts.com, password: admin123");
  }

  // Initialize Orders file
  if (!fs.existsSync(ORDERS_FILE)) {
    writeJsonFile(ORDERS_FILE, []);
    console.log("Initialized orders.json file database.");
  }
}

export const db = {
  getUsers() {
    return readJsonFile(USERS_FILE, []);
  },
  saveUsers(users) {
    writeJsonFile(USERS_FILE, users);
  },
  
  getProducts() {
    return readJsonFile(PRODUCTS_FILE, []);
  },
  saveProducts(products) {
    writeJsonFile(PRODUCTS_FILE, products);
  },

  getCategories() {
    return readJsonFile(CATEGORIES_FILE, []);
  },
  saveCategories(categories) {
    writeJsonFile(CATEGORIES_FILE, categories);
  },

  getOrders() {
    return readJsonFile(ORDERS_FILE, []);
  },
  saveOrders(orders) {
    writeJsonFile(ORDERS_FILE, orders);
  },
};
