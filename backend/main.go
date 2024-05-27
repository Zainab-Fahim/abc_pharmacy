package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Product struct {
	ID        uint        `gorm:"primaryKey"`
	Name      string      `gorm:"not null"`
	Category  string      `gorm:"not null"`
	Price     float64     `gorm:"not null"`
	Inventory []Inventory `gorm:"foreignKey:ProductID"`
}

type Inventory struct {
	ID           uint `gorm:"primaryKey"`
	ProductID    uint `gorm:"not null"`
	Stock        int  `gorm:"not null"`
	ReorderLevel int  `gorm:"not null"`
}

type Customer struct {
	ID    uint   `gorm:"primaryKey"`
	Name  string `gorm:"not null"`
	Email string `gorm:"not null"`
	Phone string `gorm:"not null"`
}

type Order struct {
	ID          uint          `gorm:"primaryKey"`
	CustomerID  uint          `gorm:"not null"`
	Customer    Customer      `gorm:"foreignKey:CustomerID"` // This line ensures GORM handles the relationship
	OrderDate   time.Time     `gorm:"not null"`
	TotalAmount float64       `gorm:"not null"`
	OrderStatus string        `gorm:"not null"`
	Details     []OrderDetail `gorm:"foreignKey:OrderID"`
}

type OrderDetail struct {
	ID           uint    `gorm:"primaryKey"`
	OrderID      uint    `gorm:"not null"`
	ProductID    uint    `gorm:"not null"`
	Quantity     int     `gorm:"not null"`
	PricePerUnit float64 `gorm:"not null"`
}

var db *gorm.DB

func main() {
	dsn := "host=localhost user=postgres password=root dbname=abc_pharmacy_db port=5432 sslmode=disable"
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	db.AutoMigrate(&Product{}, &Inventory{}, &Customer{}, &Order{}, &OrderDetail{})

	r := gin.Default()

	// Enable CORS
	r.Use(cors.Default())

	// Product routes
	r.GET("/products", getProducts)
	r.POST("/products", createProduct)
	r.GET("/products/:id", getProduct)
	r.PUT("/products/:id", updateProduct)
	r.DELETE("/products/:id", deleteProduct)
	r.GET("/products/total", getTotalProducts)

	// Inventory routes
	r.GET("/inventory", getInventory)
	r.GET("/inventory/:id", getInventoryItem)
	r.PUT("/inventory/:id", updateInventory)
	r.DELETE("/inventory/:id", deleteInventory)
	r.POST("/inventory", createInventoryItem)
	r.GET("/inventory/low-stock", getLowStockItems)

	// Customer routes
	r.GET("/customers", getCustomers)
	r.POST("/customers", createCustomer)
	r.GET("/customers/:id", getCustomer)
	r.PUT("/customers/:id", updateCustomer)
	r.DELETE("/customers/:id", deleteCustomer)
	r.GET("/customers/total", getTotalCustomers)
	r.GET("/customers/:id/orders", getCustomerOrders)

	// Order routes
	r.GET("/orders", getOrders)
	r.POST("/orders", createOrder)
	r.GET("/orders/:id", getOrder)
	r.PUT("/orders/:id", updateOrder)
	r.DELETE("/orders/:id", deleteOrder)
	r.GET("/orders/recent", getRecentOrders)
	r.GET("/orders/total-sales", getTotalSales)
	r.GET("/orders/today", getTodayTransactions)

	// OrderDetail routes
	r.GET("/orderdetails", getOrderDetails)
	r.POST("/orderdetails", createOrderDetail)
	r.GET("/orderdetails/:id", getOrderDetail)
	r.PUT("/orderdetails/:id", updateOrderDetail)
	r.DELETE("/orderdetails/:id", deleteOrderDetail)
	r.GET("/orderdetails/product/:id", getProductOrderDetails)

	r.Run(":8080")

}

func getProducts(c *gin.Context) {
	var products []Product
	db.Preload("Inventory").Find(&products)
	c.JSON(http.StatusOK, products)
}

func createProduct(c *gin.Context) {
	var product Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&product)
	c.JSON(http.StatusCreated, product)
}

func getProduct(c *gin.Context) {
	var product Product
	if err := db.Preload("Inventory").First(&product, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func updateProduct(c *gin.Context) {
	var product Product
	if err := db.First(&product, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&product)
	c.JSON(http.StatusOK, product)
}

func deleteProduct(c *gin.Context) {
	var product Product
	productID := c.Param("id")

	// Check if the product exists
	if err := db.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Delete related order details first
	if err := db.Where("product_id = ?", productID).Delete(&OrderDetail{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related order details", "detail": err.Error()})
		return
	}

	// Now delete related inventory items
	if err := db.Where("product_id = ?", productID).Delete(&Inventory{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related inventory items", "detail": err.Error()})
		return
	}

	// Now delete the product
	if err := db.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product", "detail": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}

func getInventory(c *gin.Context) {
	var inventory []Inventory
	db.Find(&inventory)
	c.JSON(http.StatusOK, inventory)
}

func getInventoryItem(c *gin.Context) {
	var inventory Inventory
	if err := db.First(&inventory, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inventory item not found"})
		return
	}
	c.JSON(http.StatusOK, inventory)
}

func updateInventory(c *gin.Context) {
	var inventory Inventory
	id := c.Param("id")

	if err := db.First(&inventory, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inventory not found"})
		return
	}

	if err := c.ShouldBindJSON(&inventory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Save(&inventory)
	c.JSON(http.StatusOK, inventory)
}

func deleteInventory(c *gin.Context) {
	var inventory Inventory
	if err := db.First(&inventory, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inventory item not found"})
		return
	}
	db.Delete(&inventory)
	c.JSON(http.StatusOK, gin.H{"message": "Inventory item deleted"})
}

func createInventoryItem(c *gin.Context) {
	var inventory Inventory
	if err := c.ShouldBindJSON(&inventory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Additional logic to check specific fields can be added here
	db.Create(&inventory)
	c.JSON(http.StatusCreated, inventory)
}

func getCustomers(c *gin.Context) {
	var customers []Customer
	if err := db.Find(&customers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customers)
}

func createCustomer(c *gin.Context) {
	var customer Customer
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&customer)
	c.JSON(http.StatusCreated, customer)
}

func getCustomer(c *gin.Context) {
	var customer Customer
	if err := db.First(&customer, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}
	c.JSON(http.StatusOK, customer)
}

func updateCustomer(c *gin.Context) {
	var customer Customer
	if err := db.First(&customer, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&customer)
	c.JSON(http.StatusOK, customer)
}

func deleteCustomer(c *gin.Context) {
	var customer Customer
	if err := db.First(&customer, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}
	db.Delete(&customer)
	c.JSON(http.StatusOK, gin.H{"message": "Customer deleted"})
}

func getOrders(c *gin.Context) {
	var orders []Order
	// Ensure to preload Customer data
	if err := db.Preload("Customer").Preload("Details").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func createOrder(c *gin.Context) {
	var order Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&order)
	c.JSON(http.StatusCreated, order)
}

func getOrder(c *gin.Context) {
	var order Order
	if err := db.Preload("Details").First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	c.JSON(http.StatusOK, order)
}

func updateOrder(c *gin.Context) {
	var order Order
	if err := db.Preload("Details").First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&order)
	c.JSON(http.StatusOK, order)
}

func deleteOrder(c *gin.Context) {
	var order Order
	if err := db.First(&order, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	// Delete related order details first
	if err := db.Where("order_id = ?", order.ID).Delete(&OrderDetail{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete order details", "detail": err.Error()})
		return
	}
	// Now delete the order
	db.Delete(&order)
	c.JSON(http.StatusOK, gin.H{"message": "Order and related details deleted"})
}

func getOrderDetails(c *gin.Context) {
	var orderDetails []OrderDetail
	db.Find(&orderDetails)
	c.JSON(http.StatusOK, orderDetails)
}

func createOrderDetail(c *gin.Context) {
	var orderDetail OrderDetail
	if err := c.ShouldBindJSON(&orderDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&orderDetail)
	c.JSON(http.StatusCreated, orderDetail)
}

func getOrderDetail(c *gin.Context) {
	var orderDetail OrderDetail
	if err := db.First(&orderDetail, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order detail not found"})
		return
	}
	c.JSON(http.StatusOK, orderDetail)
}

func updateOrderDetail(c *gin.Context) {
	var orderDetail OrderDetail
	if err := db.First(&orderDetail, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order detail not found"})
		return
	}
	if err := c.ShouldBindJSON(&orderDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Save(&orderDetail)
	c.JSON(http.StatusOK, orderDetail)
}

func deleteOrderDetail(c *gin.Context) {
	var orderDetail OrderDetail
	if err := db.First(&orderDetail, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order detail not found"})
		return
	}
	db.Delete(&orderDetail)
	c.JSON(http.StatusOK, gin.H{"message": "Order detail deleted"})
}

func getLowStockItems(c *gin.Context) {
	var lowStockItems []Inventory
	if err := db.Where("stock < reorder_level").Find(&lowStockItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, lowStockItems)
}

func getTotalSales(c *gin.Context) {
	var totalSales float64
	if err := db.Model(&Order{}).Select("SUM(total_amount)").Scan(&totalSales).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"total_sales": totalSales})
}

func getTotalCustomers(c *gin.Context) {
	var totalCustomers int64
	if err := db.Model(&Customer{}).Count(&totalCustomers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"total_customers": totalCustomers})
}

func getRecentOrders(c *gin.Context) {
	var recentOrders []Order
	if err := db.Order("order_date desc").Limit(10).Preload("Customer").Preload("Details").Find(&recentOrders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, recentOrders)
}

func getTotalProducts(c *gin.Context) {
	var totalProducts int64
	if err := db.Model(&Product{}).Count(&totalProducts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"total_products": totalProducts})
}

func getTodayTransactions(c *gin.Context) {
	var todayTransactions int64
	today := time.Now().Format("2006-01-02")
	if err := db.Model(&Order{}).Where("DATE(order_date) = ?", today).Count(&todayTransactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"today_transactions": todayTransactions})
}

func getCustomerOrders(c *gin.Context) {
	var orders []Order
	customerID := c.Param("id")
	if err := db.Preload("Details").Where("customer_id = ?", customerID).Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}

func getProductOrderDetails(c *gin.Context) {
	var orderDetails []OrderDetail
	productID := c.Param("id")
	if err := db.Where("product_id = ?", productID).Find(&orderDetails).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, orderDetails)
}

/*
http://localhost:8080/customers/1/orders
[{
    "ID": 1,
    "CustomerID": 1,
    "Customer": {
        "ID": 0,
        "Name": "",
        "Email": "",
        "Phone": ""
    },
    "OrderDate": "2024-05-01T12:30:00Z",
    "TotalAmount": 120.5,
    "OrderStatus": "Pending",
    "Details": [{
        "ID": 4,
        "OrderID": 1,
        "ProductID": 4,
        "Quantity": 2,
        "PricePerUnit": 5.99
    }, {
        "ID": 5,
        "OrderID": 1,
        "ProductID": 3,
        "Quantity": 1,
        "PricePerUnit": 12.99
    }]
}]




Endpoint => http://localhost:8080/orderdetails/product/2
Sample Response =>
[{
    "ID": 6,
    "OrderID": 2,
    "ProductID": 2,
    "Quantity": 3,
    "PricePerUnit": 7.99
}]


*/
