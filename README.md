# 🛒 Scratch E-Commerce Store

A full-stack e-commerce web application built from scratch using **Node.js**, **Express**, **MongoDB**, **EJS**, and **Tailwind CSS** with complete authentication & authorization, cart system, and order workflow. Includes a secure **Forgot Password / Reset Password** flow using **Nodemailer + token hashing**.

This project is split into **two sides**:
- **User Side** → shopping, cart, addresses, ordering
- **Admin/Owner Side** → product management (add/delete), admin routes

---

##  Features

### Authentication & Authorization
- User Register / Login / Logout
- Password hashing with **bcrypt**
- JWT-based session handling using **cookies**
- Role-based access (e.g., `user`, `owner/admin`)
- Protected routes using middleware (`isLoggedIn`)

---

## 🔐 Forgot Password (Secure Reset Flow)
- Generates reset token using `crypto.randomBytes`
- Stores **hashed token** in DB (`sha256`)
- Expiry support (10 min)
- Sends reset link via **Nodemailer (Gmail SMTP)** on the user's mail
- Resets password securely and invalidates the token after use

---

## ✅ Validations
- Joi-based validations for:
  - User & Owner login/register inputs
  - Password reset validation
- Central `validate()` utility for reusability

---

## 👤 User Side Features


### 🛒 Cart System
- Add product to cart
- Increase / decrease quantity (`+` / `-`)
- Remove product from cart
- Cart populated using `.populate('cart.product')`

### 📦 Order System
- Order summary page with subtotal calculations
- Create order from cart
- Snapshot-based order items (price at purchase, quantity, image)
- Automatic stock deduction when order is placed
- Clears cart after successful order

### 🏠 Address Management
- Add multiple addresses
- Set default address
- Delete address
- Default address auto-set if user adds first address


### 🛍️ Product & Shop System
- Products stored in MongoDB
- Shop page with sorting options:
  - Price (asc/desc)
  - Name (asc/desc)
  - Newest first
---

## 🛠️ Admin / Owner Side Features
- Separate Admin/Owner login route
- Admin can:
  - **Add new products**
  - **Delete products**
  - View all products
- Product management routes protected via role-based logic


## 🧠 Tech Stack

| Layer | Technology |
|------|------------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, Cookies, bcrypt |
| Frontend | EJS templates |
| Styling | Tailwind CSS |
| Emails | Nodemailer (Gmail SMTP) |
| Validation | Joi |
| Security | crypto (token hashing), expiry mechanism |

---

## 📂 Project Structure

```bash
.
├── controllers/
│   └── authController.js
├── middlewares/
│   └── isLoggedIn.js
├── models/
│   ├── user-model.js
│   ├── product-model.js
│   ├── order-model.js
│   └── owner-model.js
├── routes/
│   ├── index.js
│   └── ownerRoutes.js
├── utils/
│   ├── generateToken.js
│   └── validate.js
├── validations/
│   └── newPass.js
├── views/
│   ├── index.ejs
│   ├── shop.ejs
│   ├── cart.ejs
│   ├── forgotpass.ejs
│   ├── reset-password.ejs
│   └── admin/
└── app.js / server.js