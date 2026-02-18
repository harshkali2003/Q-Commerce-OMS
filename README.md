![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Redis](https://img.shields.io/badge/Redis-Inventory%20Locking-red)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)


# Q-Commerce OMS 🛒

A scalable **Order Management System (OMS)** built with **Node.js** designed for real-world e-commerce workflows — including cart validation, inventory reservation, store assignment, and reliable order placement.

This project goes beyond CRUD and focuses on **state orchestration**, **consistency**, and **failure-resilient flows** required in production-grade backend systems.

---

## 🔍 Overview

In an e-commerce platform, the OMS is responsible for:
- Validating cart contents
- Assigning a serviceable store based on pincode
- Reserving inventory safely using Redis locks
- Creating and managing orders with strong consistency guarantees

An Order Management System (OMS) is a core backend component used for receiving, processing, and tracking customer orders in commerce applications.

---

## 🛠 Key Features

✔ Cart validation and consistency  
✔ Store assignment based on serviceable pincode  
✔ Inventory reservation using **Redis (TTL-based locks)**  
✔ Order creation with SKU-level validation  
✔ Clear separation of inventory states:
  - **Reserve**
  - **Confirm**
  - **Release**

## 📁 Project Structure

Q-Commerce-OMS
├── config/ # environment & config files
├── middleware/ # custom express middlewares
├── modules/ # domain logic (cart, order, inventory, store)
├── service/ # service layer (Redis, store allocator)
├── utils/ # helpers & utilities
├── index.js # app entrypoint
├── package.json

## 🚀 Installation

1. Clone the repository

```bash
git clone https://github.com/harshkali2003/Q-Commerce-OMS.git
cd Q-Commerce-OMS

2. Install dependencies
--- npm install

3. Configure environment variables

Create a .env file:
PORT=5000
MONGO_URI=your_mongodb_uri
REDIS_URL=your_redis_url

4. start the server
-- node index.js

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Redis
- REST APIs
