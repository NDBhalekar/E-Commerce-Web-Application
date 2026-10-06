# E-Commerce Store

This is a Node.js and Express-based e-commerce web application built with EJS, MongoDB, Passport authentication, Cloudinary image uploads, and Stripe checkout. It is developed as an academic project, but the codebase goes beyond a basic demo and already includes the basic building blocks for a multi seller marketplace-style platform.

## Tech stack

- Node.js
- Express
- EJS with ejs-mate
- MongoDB with Mongoose
- Passport and passport-local-mongoose
- Cloudinary and Multer
- Stripe
- Bootstrap 5

## What the project does

- Product browsing with category filters and keyword search
- User signup, login, logout, and demo account login
- Product detail pages with reviews
- Cart management and checkout flow
- Stripe payment integration
- Order history for logged-in users
- Cloudinary-backed product image uploads

## Project structure

```text
config/         Stripe configuration
controllers/    Route handlers for listings, cart, orders, payment, reviews, users, webhook
init/           Seed data and database initialization
models/         Mongoose schemas for users, listings, cart, orders, reviews
public/         CSS and client-side JavaScript
routes/         Express route modules
utils/          Shared helpers and error utilities
views/          EJS templates
app.js          Application entry point
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Use the following values as a guide:

```env
PORT=3000
SESSION_SECRET=your-session-secret
MONGODB_URL=your-mongodb-connection-string
BASE_URL=http://localhost:3000

CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### 3. Start the app

```bash
npm run dev
```

or

```bash
npm start
```

### 4. Optional: seed sample listings

```bash
node init/index.js
```

Note: the seed script assigns all sample listings to a single owner ID

## Note

- The seed script in `init/index.js` currently uses a hardcoded owner ID for all sample listings. Before running the seed, make sure that ID matches an existing user in your database, or update it first.
- Admin access is not assigned automatically. The admin role is currently controlled directly from the database, so if you need an admin account, you must update the user's `role` field manually in the `users` collection.

## Current product model

The application currently behaves like a single-brand store controlled by one admin account:

- Product creation is exposed through an admin-facing flow
- Seed data assigns all products to one owner
- The initial seller is effectively the admin user behind the store

At the same time, the data model already shows that the project can be evolved into a marketplace with separate sellers:

- Each listing stores an `owner` reference to a `User`
- Listing edit and delete permissions are owner-based
- Cart, orders, reviews, and checkout are already user-centric rather than hardcoded to a single buyer session

## Future scope

- Separate platform admin permissions from seller ownership permissions
- Allow seller accounts to create and manage their own listings
- Add seller dashboards and seller-specific order handling
- Expand payment and stock flows for a true multi-seller marketplace
