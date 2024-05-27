import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CAvatar,
  CModalFooter,
} from '@coreui/react';

import CIcon from '@coreui/icons-react'
import { cilCalculator } from '@coreui/icons'

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

// Helper function to format date and time
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/orders');
      console.log("Orders: ", response);
      const ordersWithDetails = await Promise.all(response.data.map(async order => {
          console.log("Order: ", order);
          const detailsWithProductName = await Promise.all(order.Details.map(async detail => {
          console.log("Detail: ", detail);
          if (!products[detail.ProductID]) {
            const productResponse = await axios.get(`http://localhost:8080/products/${detail.ProductID}`);
            console.log("Product: ", productResponse);
            setProducts(prev => ({ ...prev, [detail.ProductID]: productResponse.data.Name }));
            return { ...detail, ProductName: productResponse.data.Name };
          }
          return { ...detail, ProductName: products[detail.ProductID] };
        }));
        return { ...order, Details: detailsWithProductName };
      }));
      setOrders(ordersWithDetails);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setViewModal(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedOrder) return;

    try {
      await axios.delete(`http://localhost:8080/orders/${selectedOrder.id}`);
      const newOrders = orders.filter(order => order.id !== selectedOrder.id);
      setOrders(newOrders);
      setDeleteModal(false);
      alert(`Order ID ${selectedOrder.id} has been deleted.`);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <>
      <CCard>
        <CCardHeader>Orders</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="text-center"> 
                  <CIcon icon={cilCalculator} />
                </CTableHeaderCell>
                <CTableHeaderCell>Customer Name</CTableHeaderCell>
                <CTableHeaderCell>Order Date</CTableHeaderCell>
                <CTableHeaderCell>Total Amount</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {orders.map((order, index) => (
                 <CTableRow v-for="order in tableItems" key={index}> 
                   <CTableDataCell className="text-center">
                      <CAvatar
                        size="md"
                        src={`https://ui-avatars.com/api/?background=random&rounded=true&bold=true&name=${index+1}`}
                      />
                  </CTableDataCell>
                  <CTableDataCell>{order.Customer.Name}</CTableDataCell>
                  <CTableDataCell>{formatDate(order.OrderDate)}</CTableDataCell>
                  <CTableDataCell>{'$ '}{order.TotalAmount}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getStatusBadge(order.OrderStatus)}>
                      {order.OrderStatus}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => handleView(order)}>
                      View
                    </CButton>{' '}
                    <CButton color="danger" size="sm" onClick={() => handleDelete(order)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={viewModal} onClose={() => setViewModal(false)}>
        <CModalHeader onClose={() => setViewModal(false)}>
          Order Details
        </CModalHeader>
        <CModalBody>
          {selectedOrder && (
            <>
              <p><strong>Order ID : </strong> {selectedOrder.ID}</p>
              <p><strong>Customer Name : </strong> {selectedOrder.Customer.Name}</p>
              <p><strong>Order Date : </strong> {formatDate(selectedOrder.OrderDate)}</p>
              <p><strong>Total Amount : </strong>{' $'}{selectedOrder.TotalAmount}</p>
              <p><strong>Status : </strong> {selectedOrder.OrderStatus}</p>
              <p><strong>Items : </strong></p>
              <ul>
                {selectedOrder.Details.map((item, index) => (
                  <li key={index}>
                    {item.ProductName} - {item.Quantity} x {' $'}{item.PricePerUnit}
                  </li>
                ))}
              </ul>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader onClose={() => setDeleteModal(false)}>
          Confirm Delete
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete Order ID {selectedOrder && selectedOrder.id}?
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={confirmDelete}>
            Delete
          </CButton>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Orders;
