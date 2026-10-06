# 🛒 MERN E-Commerce Platform

A full-stack e-commerce web application built using the MERN stack, providing a complete online shopping experience with secure authentication, product management, persistent shopping cart, online payments, cloud image storage, reviews, ratings, and role-based access control.

---

## 🚀 Live Demo

🔗 **[View Live Project](https://ecom.itsred.shop/)**

---

## 📸 Project Overview

This project is a full-stack e-commerce platform designed to simulate a real-world online shopping system.

Users can browse and search products, filter products by category, view product details, add items to a persistent shopping cart, manage quantities based on available stock, complete payments using Stripe, and leave reviews and ratings.

Administrators can manage products and perform role-based operations through protected routes.

---

## ✨ Features

### 👤 User Authentication

- User registration and login
- Secure authentication using Passport.js
- Session-based authentication
- Protected routes
- Authorization middleware
- Flash messages for user feedback
- Demo account access

### 🛍️ Product Management

- Browse available products
- Product search functionality
- Category-based filtering
- Detailed product pages
- Product inventory tracking
- Create products
- Edit products
- Delete products
- Role-based product management
- Protected administrative operations

### 🛒 Shopping Cart

- Add products to cart
- Remove products from cart
- Update product quantity
- Persistent shopping cart
- Stock availability validation
- Prevents users from ordering unavailable quantities
- Automatic cart total calculation

### 💳 Payment & Orders

- Stripe Checkout integration
- Secure online payment processing
- Stripe Webhooks
- Payment confirmation
- Automated order processing
- Order data stored in MongoDB

### ⭐ Reviews & Ratings

- Add product reviews
- Star-based rating system
- Review ownership controls
- Users can manage their own reviews
- Protected review operations
- Average product rating calculation

### 🖼️ Image Uploads

- Cloudinary integration
- Image uploads using Multer
- Cloud-based image storage
- Product image management
- Optimized image handling

### 🔐 Security & Validation

- Passport.js authentication
- Session management
- Protected routes
- Role-based authorization
- Joi server-side validation
- Centralized error handling
- Ownership-based authorization
- Environment variable configuration

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive UI

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- Mongoose

### Authentication

- Passport.js
- Express Session

### Payments

- Stripe Checkout
- Stripe Webhooks

### Image Storage

- Cloudinary
- Multer

### Validation

- Joi

### Architecture

- MVC Architecture
- RESTful API Design
- Middleware-based architecture
- Centralized error handling

---

## 🏗️ Application Architecture

The backend follows the **MVC (Model-View-Controller)** architecture to keep the application organized, maintainable, and scalable.

```text
                         ┌──────────────────┐
                         │      Client      │
                         │   Web Interface  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │      Routes      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Middleware     │
                         │ Authentication   │
                         │   Validation     │
                         │ Authorization    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Controllers    │
                         │ Business Logic   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │      Models      │
                         │    Mongoose      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     MongoDB      │
                         └──────────────────┘
