# 🏢 Enterprise IT Asset Management System

A full-stack, production-grade web application designed for enterprise resource tracking, infrastructure administration, and secure user management. 

## ✨ Core Features

* **🔐 Cryptographic Authentication:** Secure access gateway utilizing `bcrypt` password hashing and stateless JSON Web Tokens (JWT).
* **📦 Asset Lifecycle Management:** Complete CRUD functionality for hardware, software, and network assets with real-time status tracking (Available, Assigned, In Repair).
* **👥 Role-Based Directory:** Searchable user directory with dynamic filtering and analytics calculations.
* **📜 Automated Audit Trail:** Silent, asynchronous backend logging system that records administrative actions with exact timestamps and user IDs for ultimate accountability.
* **📊 Live Analytics Dashboard:** Real-time calculation of system metrics across both users and assets.

## 🛠️ Technical Architecture

### Frontend (Client-Side)
* **Framework:** React.js (Vite)
* **Styling:** Custom CSS with CSS Variables and Flexbox/Grid layouts
* **Routing/State:** React Hooks (`useState`, `useEffect`)
* **HTTP Client:** Axios

### Backend (Server-Side)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL (Relational schema with foreign keys)
* **Security:** `jsonwebtoken` (JWT), `bcrypt`
* **Middleware:** `cors`

## 🚀 Local Installation

If you would like to run this application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YourUsername/it-asset-management.git](https://github.com/YourUsername/it-asset-management.git)
