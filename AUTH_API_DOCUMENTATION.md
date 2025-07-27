# Yellow Tea Admin API Documentation

## Overview
This document describes all admin API endpoints for the Yellow Tea backend. All endpoints require authentication as an admin user (JWT token in `Authorization: Bearer <token>` header).

---

## Authentication
- All admin endpoints require a valid JWT token for an admin user.
- Add the token to the `Authorization` header: `Bearer <token>`

---

## Base URL
```
/api/v1/admin
```

---

## Table of Contents
- [Dashboard](#dashboard)
- [Customers](#customers)
- [Orders](#orders)
- [Products](#products)
- [Logs](#logs)
- [User Management](#user-management)
- [Analytics](#analytics)
- [System Operations](#system-operations)

---

## Dashboard
### Get Admin Dashboard Data
- **Endpoint:** `GET /dashboard`
- **Description:** Returns overview stats, recent activity, analytics, and top products.
- **Auth:** Admin
- **Response:**
```json
{
  "success": true,
  "data": {
    "overview": { "totalUsers": 100, "totalOrders": 200, "totalProducts": 50, "totalRevenue": 12345 },
    "recentActivity": { "orders": [ ... ], "users": [ ... ] },
    "analytics": { "monthlyStats": [ ... ], "topProducts": [ ... ], "orderStatusDistribution": [ ... ] }
  }
}
```

---

## Customers
### List Customers
- **Endpoint:** `GET /customers`
- **Query Params:** `page`, `limit`, `search`, `sort`
- **Description:** Paginated, searchable list of users.
- **Auth:** Admin
- **Response:**
```json
{
  "success": true,
  "data": { "users": [ ... ], "pagination": { ... } }
}
```

### Get Customer by ID
- **Endpoint:** `GET /customers/:id`
- **Description:** Get user details, order history, and stats.
- **Auth:** Admin

### Update Customer
- **Endpoint:** `PUT /customers/:id`
- **Body:** `{ name, email, ... }`
- **Description:** Update user info (except password).
- **Auth:** Admin

### Delete Customer
- **Endpoint:** `DELETE /customers/:id`
- **Description:** Delete a user (cannot delete self).
- **Auth:** Admin

---

## Orders
### List Orders
- **Endpoint:** `GET /orders`
- **Query Params:** `page`, `limit`, `sort`, `status`, ...
- **Description:** Paginated, filterable list of orders.
- **Auth:** Admin

### Get Order by ID
- **Endpoint:** `GET /orders/:id`
- **Description:** Get order details, user info, items, etc.
- **Auth:** Admin

### Update Order Status
- **Endpoint:** `PUT /orders/:id/status`
- **Body:** `{ status: "processing" | "shipped" | "delivered" | "cancelled", notes? }`
- **Description:** Update order status and notify user.
- **Auth:** Admin

### Get Order Stats
- **Endpoint:** `GET /orders/stats`
- **Description:** Get order statistics, sales, top products, etc.
- **Auth:** Admin

### Order Model Reference
- See [order.model.js](#order-model)

---

## Products
### List Products
- **Endpoint:** `GET /products`
- **Query Params:** `page`, `limit`, `search`, `sort`, ...
- **Description:** Paginated, filterable list of products.
- **Auth:** Admin

### Get Product by ID
- **Endpoint:** `GET /products/:id`
- **Description:** Get product details.
- **Auth:** Admin

### Create Product
- **Endpoint:** `POST /products`
- **Body:** `multipart/form-data` (fields: name, price, ...; files: images[])
- **Description:** Create a new product with images.
- **Auth:** Admin

### Update Product
- **Endpoint:** `PUT /products/:id`
- **Body:** `multipart/form-data` (fields: ...; files: images[])
- **Description:** Update product details and images.
- **Auth:** Admin

### Delete Product
- **Endpoint:** `DELETE /products/:id`
- **Description:** Delete a product.
- **Auth:** Admin

### Get Product Stats
- **Endpoint:** `GET /products/stats`
- **Description:** Get product statistics, low stock, etc.
- **Auth:** Admin

### Product Model Reference
- See [product.model.js](#product-model)

---

## Logs
### Get Admin Logs
- **Endpoint:** `GET /logs`
- **Query Params:** `page`, `limit`, `sort`, ...
- **Description:** Get admin activity logs.
- **Auth:** Admin

---

## User Management
### Update User Role
- **Endpoint:** `PUT /users/:id/role`
- **Body:** `{ role: "user" | "admin" }`
- **Description:** Update a user's role.
- **Auth:** Admin

### Delete User
- **Endpoint:** `DELETE /users/:id`
- **Description:** Delete a user (cannot delete self).
- **Auth:** Admin

---

## Analytics
### Get Analytics
- **Endpoint:** `GET /analytics?period=30`
- **Description:** Get analytics for users, orders, revenue, daily stats for the period (default 30 days).
- **Auth:** Admin

---

## System Operations
### System Health
- **Endpoint:** `GET /system/health`
- **Description:** Get system health, uptime, memory, etc.
- **Auth:** Admin

### Clear Cache
- **Endpoint:** `POST /system/cache/clear`
- **Description:** Clear system cache (if implemented).
- **Auth:** Admin

---

## Order Model
See `src/models/order.model.js` for full schema. Key fields:
- `user`: User reference
- `orderItems`: Array of items (name, quantity, price, product ref)
- `shippingAddress`: Address object
- `paymentMethod`: Enum
- `status`: Enum (pending, processing, shipped, delivered, cancelled, refunded)
- `totalPrice`, `isPaid`, `deliveredAt`, `trackingNumber`, etc.

---

## Product Model
See `src/models/product.model.js` for full schema. Key fields:
- `name`, `slug`, `category`, `type`, `price`, `images`, `badges`, `taste_notes`, `tags`, etc.
- `rating`, `reviewCount`, `origin`, `brewing`, `scan_to_brew`, `qr_code`

---

## Example Request: Get All Orders
```http
GET /api/v1/admin/orders?page=1&limit=20&status=shipped
Authorization: Bearer <token>
```

## Example Response: Get All Orders
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "...",
        "orderNumber": "YT-20240601-0001",
        "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
        "orderItems": [ ... ],
        "status": "shipped",
        ...
      }
    ],
    "pagination": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 }
  }
}
```

---

## Error Handling
- All errors return a JSON object with `success: false` and a `message` field.
- Example:
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

## Notes
- All endpoints require admin authentication.
- For file uploads, use `multipart/form-data` and send images as `images[]`.
- For more details, see the referenced controller and model files in the codebase. 