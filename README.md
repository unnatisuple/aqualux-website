# AquaLux — Bath & Sanitary E-Commerce Website

A fully functional bath and sanitary products e-commerce website with:
- Customer storefront with Razorpay payment integration
- Admin dashboard with order, product, and payment management
- Built with React + Tailwind CSS

---

## 🚀 Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 🛍️ Customer Demo Credentials

| Field | Value |
|-------|-------|
| Email | priya@example.com |
| Password | test123 |

---

## 🔐 Admin Login

| Field | Value |
|-------|-------|
| URL | http://localhost:5173/admin/login |
| Email | admin@aqualux.com |
| Password | admin123 |

---

## 💳 Payment Setup (Razorpay)

1. Go to [razorpay.com](https://razorpay.com) and create a business account
2. Complete KYC verification (takes 2–5 business days)
3. Go to **Dashboard → Settings → API Keys**
4. Copy your **Key ID** (starts with `rzp_test_` for test or `rzp_live_` for production)
5. In your AquaLux admin panel: **Admin → Settings → Razorpay Key ID**
6. Paste your Key ID and click **Save Settings**

> ⚠️ Never expose your Key Secret on the frontend. Use server-side order creation for production.

---

## 📦 Project Structure

```
aqualux/
├── public/
├── src/
│   ├── admin/          # Admin panel pages (10 pages)
│   ├── components/     # Navbar, Footer, ProductCard
│   ├── context/        # State management (Cart, Auth, Orders, Products, Settings)
│   ├── data/           # Seed data (products, categories, coupons, orders)
│   ├── pages/          # Customer storefront (12 pages)
│   ├── App.jsx         # Main router
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles + Tailwind
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ✨ Features

### Customer Storefront
- 🏠 Homepage with hero, category grid, best sellers
- 🛒 Product listing with filters (category, brand, price, rating)
- 📦 Product detail with image gallery, tabs, reviews
- 🛍️ Shopping cart with coupon codes
- 💳 Checkout with Razorpay / COD / UPI / Card
- 📬 Order tracking with live timeline
- 👤 User account (profile, orders, addresses, security)
- ℹ️ About & Contact pages

### Admin Panel
- 📊 Dashboard with revenue chart (Recharts) & stock alerts
- 📦 Product management (CRUD + image preview)
- 🧾 Order management with status updates
- 👥 Customer management with block/unblock
- 🏷️ Category & coupon management
- 💰 Payment reports & transaction history
- ⚙️ Store settings (shipping, COD, Razorpay)
- 📖 Step-by-step setup guide

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS v4 | Styling |
| React Router v6 | Routing |
| Context API + localStorage | State Management |
| Recharts | Admin Dashboard Charts |
| Lucide React | Icons |
| Razorpay JS SDK | Payment Gateway |
| Google Fonts (Inter) | Typography |

---

## 🌐 Going Live

1. Replace `rzp_test_` Razorpay key with `rzp_live_` key
2. Add server-side order creation for Razorpay signature verification
3. Replace localStorage with a real database (Firebase / MongoDB / PostgreSQL)
4. Add email service (EmailJS / SendGrid) for order confirmations
5. Set up Razorpay webhook for `payment.captured` events
6. Deploy to Vercel / Netlify (add `vercel.json` for SPA routing)

---

## 📄 License

MIT License — Free to use for personal and commercial projects.
