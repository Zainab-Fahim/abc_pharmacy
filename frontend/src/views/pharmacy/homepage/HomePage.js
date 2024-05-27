import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard, CCardBody, CCardHeader, CRow, CCol, CWidgetStatsB, CTable, CTableBody, CTableRow, CTableDataCell, CTableHead, CTableHeaderCell, CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBasket, cilUser, cilChartLine } from '@coreui/icons';

// Helper function to format date and time
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Helper function to determine the badge color based on the order status
const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Pending': return 'warning';
    case 'Shipped': return 'info';
    case 'Cancelled': return 'danger';
    default: return 'secondary';
  }
};

function HomePage() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [salesChartData, setSalesChartData] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const response = await axios.get('http://localhost:8080/orders/total-sales');
      console.log("Total Sales: ", response.data.total_sales); 
      setTotalSales(response.data.total_sales);
    };


    const fetchProducts = async () => {
      const response = await axios.get('http://localhost:8080/products/total');
      console.log("Total Products: ", response.data.total_products); 
      setTotalProducts(response.data.total_products);
    };

    const fetchTodayTransactions = async () => {
      const response = await axios.get('http://localhost:8080/orders/today');
      console.log("Total Sales: ", response.data.today_transactions); 
      setTotalToday(response.data.today_transactions);
    };

    const fetchCustomers = async () => {
      const response = await axios.get('http://localhost:8080/customers/total');
      console.log("Total Customers: ", response.data.total_customers); 
      setTotalCustomers(response.data.total_customers);
    };

    const fetchRecentOrders = async () => {
      const response = await axios.get('http://localhost:8080/orders/recent');
      console.log("Recent Orders: ", response.data);
      setRecentOrders(response.data);
    };

    const fetchLowStockItems = async () => {
      const response = await axios.get('http://localhost:8080/inventory/low-stock');
      console.log("Low Stock Items: ", response.data);
      const dataWithProductDetails = await Promise.all(response.data.map(async (item) => {
        const productResponse = await axios.get(`http://localhost:8080/products/${item.ProductID}`);
        console.log('Product data:', productResponse.data);
        return {
          ...item,
          productName: productResponse.data.Name,
        };
      }));
      setLowStockItems(dataWithProductDetails);
    };

    fetchProducts();
    fetchSales();
    fetchTodayTransactions();
    fetchCustomers();
    fetchRecentOrders();
    fetchLowStockItems();
  }, []);

  return (
    <>
      <CRow className="mb-4">
        <CCol sm="6" lg="3">
          <CWidgetStatsB
            color="info"
            value={`${totalSales}`}
            title="Total Sales"
            icon={<CIcon icon={cilBasket} height={36} />}
          />
        </CCol>
        <CCol sm="6" lg="3">
          <CWidgetStatsB
            color="success"
            value={`${totalCustomers}`}
            title="Total Customers"
            icon={<CIcon icon={cilUser} height={36} />}
          />
        </CCol>
        <CCol sm="6" lg="3">
          <CWidgetStatsB
            color="primary"
            value={`${totalProducts}`}
            title="Total Products"
            icon={<CIcon icon={cilUser} height={36} />}
          />
        </CCol>
        <CCol sm="6" lg="3">
          <CWidgetStatsB
            color="secondary"
            value={`${totalToday}`}
            title="Total Transactions Today"
            icon={<CIcon icon={cilUser} height={36} />}
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="12">
          <CCard className="mb-4">
            <CCardHeader>Recent Orders</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Order ID</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {recentOrders.map((order, index) => (
                  <CTableRow v-for="order in tableItems" key={index}> 
                    <CTableDataCell>{order.ID}</CTableDataCell>
                    <CTableDataCell>{formatDate(order.OrderDate)}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusBadge(order.OrderStatus)}>
                        {order.OrderStatus}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{'$ '}{order.TotalAmount}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={{ cols: 2 }} md={{ cols: 2 }}>
          <CCard className="mb-4">
            <CCardHeader>Low Stock Items</CCardHeader>
            <CCardBody>
                <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                  <CTableHeaderCell>Product ID</CTableHeaderCell>
                    <CTableHeaderCell>Product Name</CTableHeaderCell>
                    <CTableHeaderCell>Stock</CTableHeaderCell>
                    <CTableHeaderCell>Reorder Level</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {lowStockItems.map((product) => (
                    <CTableRow key={product.ID}>
                      <CTableDataCell>{product.ProductID}</CTableDataCell>
                      <CTableDataCell>{product.productName}</CTableDataCell>
                      <CTableDataCell>{product.Stock}</CTableDataCell>
                      <CTableDataCell>{product.ReorderLevel}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
                </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default HomePage;
