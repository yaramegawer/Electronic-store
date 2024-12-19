# E-Commerce Website Backend

## Overview

This is the backend for the e-commerce website, built using Node.js and Express.js. It provides APIs for user authentication, product management, cart functionality, and order processing.

## Features

- **User Authentication**: Register, log in, and log out with JWT-based authentication.
- **Product Management**: Create, update, delete, and list products.
- **Shopping Cart**: Manage users' shopping cart with add, update, and delete items.
- **Order Processing**: Place and track orders.
- **Admin Panel**: Manage users and products (if applicable).

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing products, users, orders, and cart data
- **JWT**: JSON Web Tokens for user authentication
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js
- **Stripe**: For payment gateway integration (optional)

## Setup

To set up the backend locally, follow these steps:

### Prerequisites

- Node.js
- npm or yarn
- MongoDB (or a cloud database like MongoDB Atlas)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/e-commerce-backend.git
    cd e-commerce-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following:

    ```bash
    DB_URI=your-mongodb-uri
    JWT_SECRET=your-secret-key
    STRIPE_SECRET_KEY=your-stripe-secret-key  # Optional
    ```

4. Start the server:

    ```bash
    npm start
    ```

    The server will start on `http://localhost:5000`.

### Available API Endpoints

- **POST /auth/register**: Register a new user
- **POST /auth/login**: Log in and obtain a JWT token
- **GET /product**: List all products
- **GET /product/:id**: Get a product by ID
- **POST /product**: Add a new product (Admin only)
- **PUT /product/:id**: Update an existing product (Admin only)
- **DELETE /product/:id**: Delete a product (Admin only)
- **GET /cart**: Get the user's cart
- **POST /cart**: Add an item to the cart
- **PUT /cart/:itemId**: Update the cart item quantity
- **DELETE /cart/:itemId**: Remove an item from the cart
- **POST /order**: Place a new order

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Express.js, MongoDB, and JWT for the foundational tools in this project.
