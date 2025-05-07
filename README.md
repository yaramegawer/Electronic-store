# 📚 Electronic Store - API Documentation

## Table of Contents
- [Authentication APIs](#authentication-apis-auth)
- [Cart APIs](#cart-apis-cart)
- [Order APIs](#order-apis-order)
- [Product APIs](#product-apis-product)
- [Notes](#notes)

---

## Authentication APIs (`/auth`)

### 📌 Register a new user
- **Endpoint:** `POST /auth/register`
- **Body:**
  ```json
  {
    "userName": "string (3-20 chars)",
    "email": "valid email",
    "password": "string",
    "confirmPassword": "same as password"
  }
  ```

### 📌 Login
- **Endpoint:** `POST /auth/login`
- **Body:**
  ```json
  {
    "email": "valid email",
    "password": "string"
  }
  ```

### 📌 Send forget code
- **Endpoint:** `PATCH /auth/forgetCode`
- **Body:**
  ```json
  {
    "email": "valid email"
  }
  ```

### 📌 Reset password
- **Endpoint:** `PATCH /auth/resetPassword`
- **Body:**
  ```json
  {
    "email": "valid email",
    "forgetCode": "5 characters code",
    "password": "string",
    "confirmPassword": "same as password"
  }
  ```

---

## Cart APIs (`/cart`)

### 📌 Add product to cart
- **Endpoint:** `POST /cart`
- **Body:**
  ```json
  {
    "productId": "valid MongoDB ObjectId",
    "quantity": number (min 1)
  }
  ```

### 📌 Get user cart
- **Endpoint:** `GET /cart`
- **Query Params (Optional):** `cartId`

### 📌 Remove product from cart
- **Endpoint:** `PATCH /cart/:productId`
- **Body:**
  ```json
  {
    "productId": "valid MongoDB ObjectId"
  }
  ```

### 📌 Clear cart
- **Endpoint:** `PUT /cart`
- **Body:** _No body required._

---

## Order APIs (`/order`)

### 📌 Create new order
- **Endpoint:** `POST /order`
- **Body:**
  ```json
  {
    "phone": "string",
    "address": "string",
    "payment": "cash" or "visa"
  }
  ```

### 📌 Cancel order
- **Endpoint:** `PATCH /order/:id`
- **Body:**
  ```json
  {
    "id": "valid MongoDB ObjectId"
  }
  ```

---

## Product APIs (`/product`)

### 📌 Create new product
- **Endpoint:** `POST /product`
- **Body (Form-Data, not JSON):**

| Field | Type | Description |
|:------|:-----|:------------|
| `name` | string (2-20 chars) | Required |
| `description` | string (10-200 chars) | Optional |
| `availableItems` | integer (>=1) | Required |
| `price` | integer (>=1) | Required |
| `productImage` | file (image) | Required |

> 🔥 **Note:** Use `multipart/form-data` for this endpoint because it includes an image upload.

### 📌 Delete a product
- **Endpoint:** `DELETE /product/:id`
- **Body:**
  ```json
  {
    "id": "valid MongoDB ObjectId"
  }
  ```

### 📌 Get all products
- **Endpoint:** `GET /product`
- **Body:** _No body required._
- Query Parameters (optional):

keyword (string): Filter products based on a search keyword (e.g., product name or description).

sort (string): Sort products by a specific field. Common values might include price, name, etc. (Use - for descending, e.g., -price)

Example Request:

GET /product?keyword=shirt&sort=price

---

# 📌 Notes
- `confirmPassword` must exactly match `password` for registration and resetting password.
- **Authentication (Bearer Token)** is required for Cart, Order, and Product creation actions.
- All IDs must be valid **MongoDB ObjectIds** (24 hexadecimal characters).
- Use a tool like **Postman** or **Insomnia** for testing file uploads.

---

# 📂 Example Usage

To add a product:
```bash
POST /product
token: YOUR_TOKEN
Content-Type: multipart/form-data
```

---

# 📅 Project Setup

1. Clone the repository:
```bash
git clone git@github.com:yaramegawer/Electronic-store.git
```
2. Navigate to the project folder:
```bash
cd Electronic-store
```
3. Install dependencies:
```bash
npm install
```
4. Set up environment variables in a `.env` file (example: Stripe keys, database connection, JWT secrets).
5. Start the development server:
```bash
npm run dev
```

---

# 🌟 Happy Coding!

