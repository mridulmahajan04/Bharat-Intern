<!-- PROJECT BANNER -->
<p align="center">
  <img src="https://via.placeholder.com/800x200?text=Aniicone's+Caf%C3%A9+Management+System" alt="Aniicone's Café Management System Banner"/>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Build Status"></a>
  <a href="#"><img src="https://img.shields.io/badge/issues-0%20open-blue.svg" alt="Issues"></a>
</p>

# Aniicone's Café Management System

A modern, full-stack web application for managing café operations: menu, orders, billing, and more.

---

## 🚀 Quickstart

```bash
# Clone the repository
git clone https://github.com/yourusername/aniicone-cafe-management.git
cd aniicone-cafe-management

# Backend setup
cd backend
npm install
cp .env.example .env # Create your .env file and fill in the values
npm run dev

# Frontend setup (in a new terminal)
cd ../frontend
npm install
cp .env.local.example .env.local # Create your .env.local file and fill in the values
npm run dev
```

---

## 🗂️ Project Structure

```
BharatIntern_CafeWebsite/
├── backend/        # Express.js API, MongoDB, Firebase Admin
├── frontend/       # Next.js 13+, Tailwind CSS, Firebase Auth
├── package.json    # Root config (monorepo tools)
└── README.md       # Project documentation
```

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Firebase Authentication

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB
- Firebase Admin SDK

---

## ✨ Features

- 🍽️ Dynamic menu management
- 📱 Mobile-first responsive design
- 🔐 Secure authentication with Firebase
- 📊 Real-time order tracking
- 💳 Integrated billing system
- 👥 User role management (Admin/Customer)
- 📄 PDF bill generation

---

## ⚙️ Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Firebase project
- npm or yarn

---

## 📝 Setup Instructions

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aniicone-cafe
   JWT_SECRET=your_jwt_secret_key_here
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the frontend directory with:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
4. Start the frontend server:
   ```bash
   npm run dev
   ```

---

## 📚 API Endpoints

<details>
<summary><strong>Menu</strong></summary>

- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get menu items by category
- `POST /api/menu` - Add new menu item (Admin only)
- `PUT /api/menu/:id` - Update menu item (Admin only)
- `DELETE /api/menu/:id` - Delete menu item (Admin only)
</details>

<details>
<summary><strong>Orders</strong></summary>

- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status (Admin only)
- `PATCH /api/orders/:id/payment` - Update payment status
</details>

<details>
<summary><strong>Users</strong></summary>

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users` - Get all users (Admin only)
- `PATCH /api/users/:id/role` - Update user role (Admin only)
</details>

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 