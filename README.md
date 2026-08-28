<div align="center">
  <h1>🌱 AgriVault</h1>
  
  **A simple, secure, and modern wholesale agricultural supply chain platform.**

  [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
</div>

---

## 📖 Project Description

**AgriVault** is a platform built to help farmers, suppliers, and agricultural businesses buy and sell farming supplies in bulk. By digitizing the wholesale process, AgriVault provides three distinct, easy-to-use portals for customers, staff, and administrators.

The project focuses on practical security, clear user interfaces, and reliable data management to ensure that agricultural supplies can be ordered and tracked efficiently.

---

## ✨ Key Features

### 🚀 Three Specialized Portals
- **🧑‍🌾 Customer Portal:** Browse the live market catalog, submit bulk purchase orders or supply deliveries, track request status, and contact support.
- **👨‍💼 Staff Portal:** Review and process pending customer requests, manage warehouse inventory, and monitor real-time fulfillment statistics.
- **👑 Vault Admin Portal:** Oversee the entire platform, manage staff accounts, monitor the global audit ledger, and respond to customer support tickets.

### 🛡️ Security Features
- **OTP Verification:** Registration and password resets require One-Time Passwords sent to the user's email.
- **Brute-Force Protection:** Users are temporarily locked out for 2 minutes after 5 failed login attempts, displaying a live countdown timer.
- **Session Management:** Uses secure JWT and HTTP-Only Cookies along with Next.js route protection.
- **Password Policies:** Enforced strict password length and character requirements.

### 🎨 Design Highlights
- Built with **Tailwind CSS** for a clean, responsive layout.
- Uses **Framer Motion** for smooth, subtle animations.
- Full dark mode support integrated across all components.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Next.js Route Handlers (API), Node.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT), Jose, Bcrypt
- **Email Service:** Nodemailer

---

## ⚙️ Local Development Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/AgriVault.git
cd AgriVault
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory and add the following keys:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Email configuration for OTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Admin & Staff Setup
ADMIN_EMAIL=admin@agrivault.com
ADMIN_PASSWORD=your_admin_password
ADMIN_SECRET_KEY=admin_registration_secret
STAFF_SECRET_KEY=staff_registration_secret
```

### 4. Run the development server
```bash
npm run dev
```

The application will start at `http://localhost:3000`. 

---

## 📖 How It Works (For Customers)

1. **Find What You Need:** Browse the live market catalog to view available stock and prices.
2. **Place Your Request:** Enter the required quantity and submit a purchase order or supply delivery.
3. **Wait for Approval:** Staff reviews and approves the request based on warehouse capacity.
4. **Fulfillment:** Monitor the status of your request in the "My Requests" tab until delivery is complete.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.
