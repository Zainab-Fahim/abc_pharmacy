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
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react';

// Sample customers data
const initialCustomersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    totalPurchases: '$500',
    lastPurchaseDate: '2024-05-01',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    totalPurchases: '$800',
    lastPurchaseDate: '2024-05-02',
  },
  // Add more customers as needed
];

const Customers1 = () => {
  const [customersData, setCustomersData] = useState(initialCustomersData);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    totalPurchases: '',
    lastPurchaseDate: '',
  });

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      totalPurchases: '',
      lastPurchaseDate: '',
    });
    setAddModal(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalPurchases: customer.totalPurchases,
      lastPurchaseDate: customer.lastPurchaseDate,
    });
    setEditModal(true);
  };

  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    setCustomersData(customersData.filter(item => item.id !== selectedCustomer.id));
    setDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const saveChanges = () => {
    setCustomersData(
      customersData.map(item =>
        item.id === selectedCustomer.id ? { ...selectedCustomer, ...formData } : item
      )
    );
    setEditModal(false);
  };

  const addCustomer = () => {
    const newCustomer = {
      id: customersData.length + 1,
      ...formData,
    };
    setCustomersData([...customersData, newCustomer]);
    setAddModal(false);
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          Customers
          <CButton color="primary" size="sm" className="float-end" onClick={handleAdd}>
            Add Customer
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell>Total Purchases</CTableHeaderCell>
                <CTableHeaderCell>Last Purchase Date</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {customersData.map((item) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{item.id}</CTableDataCell>
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>{item.email}</CTableDataCell>
                  <CTableDataCell>{item.phone}</CTableDataCell>
                  <CTableDataCell>{item.totalPurchases}</CTableDataCell>
                  <CTableDataCell>{item.lastPurchaseDate}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => handleEdit(item)}>
                      Edit
                    </CButton>{' '}
                    <CButton color="danger" size="sm" onClick={() => handleDelete(item)}>
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Add Customer Modal */}
      <CModal visible={addModal} onClose={() => setAddModal(false)}>
        <CModalHeader onClose={() => setAddModal(false)}>
          Add Customer
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Name</CFormLabel>
              <CFormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="phone">Phone</CFormLabel>
              <CFormInput
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="totalPurchases">Total Purchases</CFormLabel>
              <CFormInput
                type="text"
                id="totalPurchases"
                name="totalPurchases"
                value={formData.totalPurchases}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="lastPurchaseDate">Last Purchase Date</CFormLabel>
              <CFormInput
                type="date"
                id="lastPurchaseDate"
                name="lastPurchaseDate"
                value={formData.lastPurchaseDate}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={addCustomer}>
            Add
          </CButton>
          <CButton color="secondary" onClick={() => setAddModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Edit Customer Modal */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CModalHeader onClose={() => setEditModal(false)}>
          Edit Customer
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="name">Name</CFormLabel>
              <CFormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="phone">Phone</CFormLabel>
              <CFormInput
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="totalPurchases">Total Purchases</CFormLabel>
              <CFormInput
                type="text"
                id="totalPurchases"
                name="totalPurchases"
                value={formData.totalPurchases}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="lastPurchaseDate">Last Purchase Date</CFormLabel>
              <CFormInput
                type="date"
                id="lastPurchaseDate"
                name="lastPurchaseDate"
                value={formData.lastPurchaseDate}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={saveChanges}>
            Save
          </CButton>
          <CButton color="secondary" onClick={() => setEditModal(false)}>
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
          Are you sure you want to delete {selectedCustomer && selectedCustomer.name}?
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

export default Customers1;
