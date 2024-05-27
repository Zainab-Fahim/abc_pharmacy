# ABC Pharmacy

ABC Pharmacy is a web application designed to manage pharmaceutical inventory, orders, and customer details. It provides an interface for viewing and managing products, tracking inventory levels, processing customer orders, and generating analytical insights.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Product Management:** Add, edit, delete, and view products.
- **Inventory Tracking:** Monitor stock levels and receive low-stock alerts.
- **Order Processing:** Manage customer orders and view order details.
- **Customer Management:** Add, edit, delete, and view customer information.
- **Analytics:** Generate insights on product sales and order trends.

## Technologies Used
- **Frontend:** React, CoreUI
- **Backend:** Go (Golang), Gin Framework
- **Database:** PostgreSQL
- **API Client:** Axios

## Installation

### Prerequisites
- Node.js and npm
- Go (Golang)
- PostgreSQL

### Steps
1. **Clone the Repository**
   ```sh
   git clone https://github.com/Zainab-Fahim/abc_pharmacy.git
   cd abc_pharmacy
   ```

2. **Setup Backend**
   - Navigate to the backend directory
     ```sh
     cd backend
     ```
   - Configure the PostgreSQL database connection in `main.go`:
     ```go
     dsn := "host=localhost user=postgres password=root dbname=abc_pharmacy_db port=5432 sslmode=disable"
     ```
   - Run the backend server
     ```sh
     go run main.go
     ```

3. **Setup Frontend**
   - Navigate to the frontend directory
     ```sh
     cd frontend
     ```
   - Install dependencies
     ```sh
     npm install
     ```
   - Run the frontend server
     ```sh
     npm start
     ```

## Usage
- Access the application at `http://localhost:3000`.
- Use the dashboard to manage products, customers, and orders.
- View analytical insights on the product and order data.

## API Endpoints

### Products
- `GET /products` - Retrieve all products
- `POST /products` - Add a new product
- `GET /products/:id` - Retrieve a product by ID
- `PUT /products/:id` - Update a product by ID
- `DELETE /products/:id` - Delete a product by ID

### Orders
- `GET /orders` - Retrieve all orders
- `POST /orders` - Create a new order
- `GET /orders/:id` - Retrieve an order by ID
- `PUT /orders/:id` - Update an order by ID
- `DELETE /orders/:id` - Delete an order by ID

### Customers
- `GET /customers` - Retrieve all customers
- `POST /customers` - Add a new customer
- `GET /customers/:id` - Retrieve a customer by ID
- `PUT /customers/:id` - Update a customer by ID
- `DELETE /customers/:id` - Delete a customer by ID

### Inventory
- `GET /inventory` - Retrieve all inventory items
- `POST /inventory` - Add a new inventory item
- `GET /inventory/:id` - Retrieve an inventory item by ID
- `PUT /inventory/:id` - Update an inventory item by ID
- `DELETE /inventory/:id` - Delete an inventory item by ID

## Screenshots

### Dashboard Dark Themed Page
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135121.png" width="900" height="450">

### Dashboard Light Theme Page
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135121.png" width="900" height="450">

### Products Page
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135158.png" width="900" height="450">

### View Product Analytics
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135339.png" width="900" height="450">

### Orders Page
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135154.png" width="900" height="450">

### View Order Details
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135348.png" width="900" height="450">

### Customers Page
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135147.png" width="900" height="450">

### Edit Customer Details
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135357.png" width="900" height="450">

### Inventory Page
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135203.png" width="900" height="450">

### Delete Inventory
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135308.png" width="900" height="450">

### Add Inventory
<img src="https://github.com/Zainab-Fahim/abc_pharmacy/blob/main/Assets/Screenshot%202024-05-27%20135329.png" width="900" height="450">


## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License
This project is licensed under the MIT License.

