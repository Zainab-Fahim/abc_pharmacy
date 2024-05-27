import React, { useState } from 'react';
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
  CModalFooter,
} from '@coreui/react';

// Sample orders data
const ordersData = [
  {
    id: 101,
    customerName: 'John Doe',
    orderDate: '2024-05-01',
    totalAmount: '$150.00',
    status: 'Completed',
    items: [
      { name: 'Aspirin', quantity: 2, price: '$50.00' },
      { name: 'Ibuprofen', quantity: 1, price: '$50.00' },
      { name: 'Amoxicillin', quantity: 1, price: '$50.00' },
    ],
  },
  {
    id: 102,
    customerName: 'Jane Smith',
    orderDate: '2024-05-02',
    totalAmount: '$200.00',
    status: 'Pending',
    items: [
      { name: 'Aspirin', quantity: 4, price: '$100.00' },
      { name: 'Ibuprofen', quantity: 2, price: '$100.00' },
    ],
  },
  // Add more orders as needed
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Shipped':
      return 'info';
    case 'Cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
};
const fetchOrders = async () => {
  try {
    const response = await axios.get('http://localhost:8080/orders');
    setOrders(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

useEffect(() => {
  fetchOrders();
}, []);

const updateOrder = async (orderData) => {
  try {
    const response = await axios.put(`http://localhost:8080/orders/${orderData.id}`, orderData);
    const updatedOrder = response.data;
    const updatedOrders = orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
    setViewModal(false);
  } catch (error) {
    console.error('Error updating order:', error);
    alert("Failed to update order");
  }
};

const confirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:8080/orders/${selectedOrder.id}`);
    const filteredOrders = orders.filter(order => order.id !== selectedOrder.id);
    setOrders(filteredOrders);
    setDeleteModal(false);
  } catch (error) {
    console.error('Error deleting order:', error);
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


const Orders = () => {
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleView = (order) => {
    setSelectedOrder(order);
    setViewModal(true);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    // Perform delete operation here
    setDeleteModal(false);
    alert(`Order ID ${selectedOrder.id} has been deleted.`);
    // After deletion, update the orders data or refetch the data
  };

  return (
    <>
      <CCard>
        <CCardHeader>Orders</CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Order ID</CTableHeaderCell>
                <CTableHeaderCell>Customer Name</CTableHeaderCell>
                <CTableHeaderCell>Order Date</CTableHeaderCell>
                <CTableHeaderCell>Total Amount</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {ordersData.map((order) => (
                <CTableRow key={order.id}>
                  <CTableDataCell>{order.id}</CTableDataCell>
                  <CTableDataCell>{order.customerName}</CTableDataCell>
                  <CTableDataCell>{order.orderDate}</CTableDataCell>
                  <CTableDataCell>{order.totalAmount}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getStatusBadge(order.status)}>
                      {order.status}
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

      {/* View Modal */}
      <CModal visible={viewModal} onClose={() => setViewModal(false)}>
        <CModalHeader onClose={() => setViewModal(false)}>
          Order Details
        </CModalHeader>
        <CModalBody>
          {selectedOrder && (
            <>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
              <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
              <p><strong>Total Amount:</strong> {selectedOrder.totalAmount}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} x {item.price}
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

      {/* Delete Confirmation Modal */}
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
