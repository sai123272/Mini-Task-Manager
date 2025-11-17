# Mini Task Manager – Backend

This is the backend service for the **Mini Task Manager** application.  
It provides user authentication (JWT-based) and task management APIs using **Node.js, Express, and SQLite**.

---

## 🚀 Tech Stack
- **Node.js**
- **Express**
- **SQLite3**
- **JWT Authentication**
- **bcrypt** for password hashing
- **CORS** enabled by default

---
To build:
    docker build -t task-manager-backend .
To run:
    docker run -p 4000:4000 task-manager-backend
