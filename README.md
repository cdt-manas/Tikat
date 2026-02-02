# Tikat - Premium Movie Booking Platform 🎬

**Tikat** is a full-stack MERN (MongoDB, Express, React, Node.js) application that facilitates seamless movie discovery and ticket booking. It features a modern, glassmorphic UI, real-time seat availability, and secure payment integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red.svg) ![Stack](https://img.shields.io/badge/MERN-Full%20Stack-green.svg)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on%20-Vercel-black.svg?style=for-the-badge&logo=vercel)](https://tikat-tau.vercel.app/)

## 🌐 Live Demo
👉 **[Click here to visit Tikat Live](https://tikat-tau.vercel.app/)**

---

## 🚀 Features

### for Users
- **Hero Carousel**: 3D interactive movie slider with auto-play using custom CSS animations.
- **Glassmorphic UI**: Premium "Now Showing" filters with real-time location and date detection.
- **Booking Engine**: Realistic curved seat map with "Available", "Selected", and "Booked" states.
- **Secure Payments**: Integrated Stripe Gateway for secure transactions.
- **Digital Tickets**: QR-code enabled tickets in "My Bookings".
- **Dynamic Content**: Auto-fetching of top movies, dynamic ranking (#1 Trending), and trailer links.

### for Admins
- **Dashboard**: Visual analytics for Total Revenue, Bookings, and Active Movies.
- **Content Management**: Add/Edit/Delete Movies, Theaters, and Shows.
- **Show Scheduling**: Manage screen allocations and showtimes.

---

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), CSS3 (Glassmorphism, Animations), Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT (JSON Web Tokens) & OTP Email Verification
- **Payments**: Stripe API

---

## ⚙️ Installation & Run Guide

### Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/tikat-web.git
cd tikat-web
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
npm run dev
\`\`\`
*The server will start on port 5001 (default).*

### 3. Frontend Setup
Open a new terminal:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`
*The application will run on `http://localhost:5173`.*

---

## 🔐 Environment Variables

Create a \`.env\` file in the \`server\` directory with the following credentials:

\`\`\`env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tikat
JWT_SECRET=your_super_secret_key
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
\`\`\`

---

## © Copyright

**All Rights Reserved.**

This project and its contents are the exclusive property of **Manas Kumar**.
Unauthorized copying, reproduction, or distribution of this code or design, in any form, is strictly prohibited.

**Created by Manas Kumar**
