# 🚀 Q-Commerce Order Management System (OMS)

A production-oriented **Order Management System (OMS)** built for quick-commerce platforms, focusing on **performance optimization, clean architecture, and scalable backend design**.

---

## 📌 Overview

This system manages the complete lifecycle of orders — from creation to retrieval — while optimizing performance using **Redis caching** and maintaining a structured backend architecture.

It simulates real-world backend systems used in platforms like Blinkit, Zepto, and Amazon.

---

## 🏗️ Architecture

The project follows a **layered + modular hybrid architecture**:

* **Modules Layer** → Handles domain-specific logic (e.g., orders)
* **Service Layer** → Centralized business logic and reusable operations
* **Middleware Layer** → Authentication, error handling, request processing
* **Utility Layer** → Helper functions and reusable utilities
* **Logger Layer** → Centralized logging system

This structure ensures:

* Separation of concerns
* Code reusability
* Maintainability

---

## ⚙️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Caching:** Redis
* **Authentication:** JWT

---

## 🔥 Key Features

* Order creation and management
* Redis-based caching for faster data retrieval
* Centralized service layer for business logic
* Middleware-based request handling
* Structured logging system
* Clean and maintainable project structure

---

## ⚡ Redis Integration (Performance Optimization)

Redis is used to enhance system performance by:

* Caching frequently accessed order data
* Reducing MongoDB query load
* Improving API response times

### Flow:

Order Request → Check Redis

* Cache Hit → Return response instantly
* Cache Miss → Fetch from DB → Store in Redis → Return

---

## 🔄 Order Flow

1. Client sends order request
2. Request passes through middleware
3. Business logic handled in service layer
4. Data stored in MongoDB
5. Frequently accessed data cached in Redis
6. Response returned to client

---

## 📂 Project Structure

config/        → Environment & DB configuration  
logger/        → Logging system  
middleware/    → Custom middlewares  
modules/       → Feature-based modules (e.g., orders)  
service/       → Central business logic layer  
utils/         → Helper functions  

index.js       → Application entry point  
```

---

## 📡 API Endpoints (Sample)

* `POST /orders/create` → Create new order
* `GET /orders/:id` → Get order by ID
* `GET /orders` → Get all orders

---

## 🧠 Engineering Decisions

### Why Redis?

To reduce latency and improve performance for frequently accessed order data.

### Why separate service layer?

To centralize business logic and promote reusability across modules.

### Why logging layer?

To track application behavior and simplify debugging.

---

## 🚀 Future Improvements

* Introduce message queues (BullMQ / Kafka) for async processing
* Implement microservices architecture
* Add rate limiting and API throttling
* Enhance caching strategies (TTL, invalidation)

---

## 🏁 Conclusion

This project demonstrates strong backend engineering concepts including:

* API design
* Performance optimization using Redis
* Layered architecture
* Real-world system thinking

---

## 👨‍💻 Author

Harsh Vardhan
Backend Developer | MERN Stack | System Design Enthusiast
