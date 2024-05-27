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
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CAvatar,
} from '@coreui/react';

import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'


const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [viewEditModal, setViewEditModal] = useState(false);

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const updateCustomer = async () => {
    if (!selectedCustomer || !selectedCustomer.ID) {
        console.error("No customer selected for update");
        return;
    }
    
    try {
        const response = await axios.put(`http://localhost:8080/customers/${selectedCustomer.ID}`, {
            Name: formData.Name,
            Email: formData.Email,
            Phone: formData.Phone
        });

        const updatedCustomer = response.data;
        const updatedCustomers = customers.map(customer =>
            customer.ID === updatedCustomer.ID ? updatedCustomer : customer
        );
        setCustomers(updatedCustomers);
        setViewEditModal(false); // Close the modal after saving
    } catch (error) {
        console.error('Error updating Customer:', error);
        alert("Failed to update Customer");
    }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const closeEditModal = () => {
    setViewEditModal(false);
    setFormData({
        Name: '',
        Email: '',
        Phone: ''
    });
};


  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      Name: customer.Name, 
      Email: customer.Email,
      Phone: customer.Phone
    });
    setViewEditModal(true); // Open the modal
};


  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModal(true);
  };

  const handleAnalytics = () => {
    setAnalyticsModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/customers/${selectedCustomer.ID}`);
      setCustomers(customers.filter(cust => cust.ID !== selectedCustomer.ID));
      setDeleteModal(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          Customers
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
              <CTableHeaderCell className="text-center"> 
                  <CIcon icon={cilUser} />
                </CTableHeaderCell>
                <CTableHeaderCell>Customer Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                {/* <CTableHeaderCell>Analytics</CTableHeaderCell> */}
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {customers.map((customer, index) => (
                <CTableRow v-for="cust in tableItems" key={index}> 
                  <CTableDataCell className="text-center">
                      <CAvatar
                        size="md"
                        src={`https://ui-avatars.com/api/?background=random&rounded=true&bold=true&name=${index+1}`}
                      />
                    </CTableDataCell>
                  <CTableDataCell>{customer.Name}</CTableDataCell>
                  <CTableDataCell>{customer.Email}</CTableDataCell>
                  <CTableDataCell>{customer.Phone}</CTableDataCell>
                  {/* <CTableDataCell>
                    <CButton color="info" onClick={handleAnalytics}>
                      Analytics
                    </CButton>
                  </CTableDataCell> */}
                  <CTableDataCell>
                    <CButton color="success" onClick={() => handleEdit(customer)}>
                      Edit
                    </CButton>{' '}
                    <CButton color="danger" onClick={() => handleDelete(customer)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Analytics Modal */}
      <CModal visible={analyticsModal} onClose={() => setAnalyticsModal(false)}>
        <CModalHeader onClose={() => setAnalyticsModal(false)}>
          Customer Analytics
        </CModalHeader>
        <CModalBody>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend...
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAnalyticsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Modal */}
      <CModal visible={viewEditModal} onClose={closeEditModal}>
        <CModalHeader onClose={closeEditModal}>
          Customer Product
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="customerName">Customer Name</CFormLabel>
              <CFormInput
                type="text"
                id="customerName"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                type="text"
                id="email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="phone">Phone Number</CFormLabel>
              <CFormInput
                type="text"
                id="phone"
                name="Phone"
                value={formData.Phone}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={updateCustomer}>
            Save Changes
          </CButton>
          <CButton color="secondary" onClick={closeEditModal}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader onClose={() => setDeleteModal(false)}>
          Confirm Delete
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete {selectedCustomer && selectedCustomer.Name}?
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

export default Customers;
