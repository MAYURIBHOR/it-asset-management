# IT Asset Management Dashboard

A full-stack web application built to track company hardware, manage user assignments, and log administrative actions. I built this project to deepen my understanding of backend routing, relational databases, and secure authentication.

## 🛠️ The Tech Stack

I chose a relational SQL database over a NoSQL solution because asset tracking requires strict relationships (e.g., an asset can only belong to one user at a time).

* **Frontend:** React.js, standard CSS
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Security:** JSON Web Tokens (JWT) for session management, bcrypt for password hashing

## ✨ What I Learned & Implemented

* **CRUD Operations:** Built out full Create, Read, Update, and Delete endpoints using Express routers to manage the MySQL database.
* **Relational Database Design:** Engineered a schema where the `assets` table successfully links to the `users` table via foreign keys.
* **Custom Audit Trail:** Wrote asynchronous backend logic to automatically log a timestamped record every time an asset is created, updated, or deleted.
* **State Management:** Used React `useState` and `useEffect` to handle UI updates and filter data without refreshing the page.

## 🚀 How to Run Locally

1. Clone this repository.
2. Ensure XAMPP (or another MySQL server) is running.
3. Import the database tables into a database named `it_asset_db`.
4. In the `backend` folder, run `npm install` and then `node server.js`.
5. In the `frontend` folder, run `npm install` and then `npm run dev`.
