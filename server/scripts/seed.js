// server/scripts/seed.js
// Strategy: UPSERT (idempotent). Safe to run many times, even on shared Atlas.
// Users are matched by email, profiles by userId, stores by userId,
// products by (storeId, name). Nothing is deleted.
//
// Fixed test accounts (password for all: Password123!)
//   vendor-a@test.local    vendor
//   vendor-b@test.local    vendor
//   customer-a@test.local  customer
//   customer-b@test.local  customer
// Stores: vendor-a-market, vendor-b-market

import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../src/shared/db.js";
import User from "../src/modules/users/user.model.js";
import Profile from "../src/modules/users/profile.model.js";
import Store from "../src/modules/stores/store.model.js";
import Product from "../src/modules/products/product.model.js";

const TEST_PASSWORD = "Password123!";
const opts = {
  upsert: true,
  returnDocument: "after",
  runValidators: true,
  setDefaultsOnInsert: true,
};

const USERS = [
  { email: "vendor-a@test.local", role: "vendor", displayName: "Vendor A" },
  { email: "vendor-b@test.local", role: "vendor", displayName: "Vendor B" },
  {
    email: "customer-a@test.local",
    role: "customer",
    displayName: "Customer A",
  },
  {
    email: "customer-b@test.local",
    role: "customer",
    displayName: "Customer B",
  },
];

const STORES = [
  {
    ownerEmail: "vendor-a@test.local",
    name: "Vendor A Market",
    slug: "vendor-a-market",
  },
  {
    ownerEmail: "vendor-b@test.local",
    name: "Vendor B Market",
    slug: "vendor-b-market",
  },
];

// Prices in PKR (change to your locale if you like)
const PRODUCTS = [
  {
    name: "Organic Bananas",
    unit: "bunch",
    price: 220,
    isPerishable: true,
    category: "produce",
    isPublished: true,
    stockQty: 40,
  },
  {
    name: "Whole Milk 1L",
    unit: "L",
    price: 290,
    isPerishable: true,
    category: "dairy",
    isPublished: true,
    stockQty: 60,
  },
  {
    name: "Sourdough Loaf",
    unit: "each",
    price: 450,
    isPerishable: true,
    category: "bakery",
    isPublished: true,
    stockQty: 15,
  },
  {
    name: "Basmati Rice 1kg",
    unit: "pack",
    price: 520,
    isPerishable: false,
    category: "pantry",
    isPublished: true,
    stockQty: 100,
  },
  {
    name: "Frozen Peas 500g",
    unit: "pack",
    price: 280,
    isPerishable: false,
    category: "frozen",
    isPublished: false,
    stockQty: 30,
  },
  {
    name: "Orange Juice 1L",
    unit: "L",
    price: 350,
    isPerishable: true,
    category: "beverages",
    isPublished: true,
    stockQty: 25,
  },
];

async function seed() {
  await connectDB();

  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  // 1. Users + 2. Profiles
  const usersByEmail = {};
  for (const u of USERS) {
    const user = await User.findOneAndUpdate(
      { email: u.email },
      {
        $set: { role: u.role, isVerified: true },
        $setOnInsert: { passwordHash },
      },
      opts,
    );
    usersByEmail[u.email] = user;

    await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: { displayName: u.displayName } },
      opts,
    );
  }

  // 3. Stores + 4. Products
  let productCount = 0;
  for (const s of STORES) {
    const owner = usersByEmail[s.ownerEmail];
    const store = await Store.findOneAndUpdate(
      { userId: owner._id },
      { $set: { name: s.name, slug: s.slug, isActive: true } },
      opts,
    );

    for (const p of PRODUCTS) {
      await Product.findOneAndUpdate(
        { storeId: store._id, name: p.name },
        { $set: { ...p, storeId: store._id } },
        opts,
      );
      productCount++;
    }
  }

  // 5. CartItems and 6. Orders: intentionally skipped (0)

  console.log(
    `Seed complete: ${await User.countDocuments()} users, ` +
      `${await Profile.countDocuments()} profiles, ` +
      `${await Store.countDocuments()} stores, ` +
      `${await Product.countDocuments()} products ` +
      `(${productCount} upserted this run)`,
  );
}

seed()
  .then(async () => {
    await disconnectDB();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Seed failed:", err.message);
    await disconnectDB().catch(() => {});
    process.exit(1);
  });
