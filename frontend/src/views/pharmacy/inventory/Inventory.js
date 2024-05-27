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
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CAvatar,
  CFormSelect,
} from '@coreui/react';

import CIcon from '@coreui/icons-react'
import { cilListRich } from '@coreui/icons'



const getStatusText = (stock, reorderLevel) => {
  if (stock === 0) {
    return 'Out of Stock';
  } else if (stock < reorderLevel) {
    return 'Low Stock';
  } else {
    return 'In Stock';
  }
};


const Inventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [products, setProducts] = useState([]);
  const [viewEditModal, setViewEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formDataAddInven, setFormDataAddInven] = useState({
    productId: '',
    stock: '',
    reorderLevel: ''
  });

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
    stock: '',
    reorderLevel: '',
  });

  useEffect(() => {
    fetchInventoryData();
    fetchProductsData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/inventory');
      console.log('Inventory data:', response.data);
      const dataWithProductDetails = await Promise.all(response.data.map(async (item) => {
        const productResponse = await axios.get(`http://localhost:8080/products/${item.ProductID}`);
        console.log('Product data:', productResponse.data);
        return {
          ...item,
          productName: productResponse.data.Name,
          category: productResponse.data.Category,
          price: productResponse.data.Price,
        };
      }));
      setInventoryData(dataWithProductDetails);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };
  const fetchProductsData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };
  const handleViewEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.productName,
      category: product.category,
      price: product.price,
      stock: product.Stock,
      reorderLevel: product.ReorderLevel,
    });
    console.log('reorderLevel:', product.ReorderLevel);
    setViewEditModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/inventory/${selectedProduct.ID}`);
      setInventoryData(inventoryData.filter(item => item.ID !== selectedProduct.ID));
      setDeleteModal(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const determineStatus = (stock, reorderLevel) => {
    if (stock === 0) {
      return 'Out of Stock';
    } else if (stock <= reorderLevel) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }; 

  const getStatusBadge = (stock, reorderLevel) => {
    // console.log('Stock:', stock, 'Reorder Level:', reorderLevel);
    stock= parseInt(stock);
    if (stock === 0) {
      return 'danger'; // Out of Stock
    } else if (stock < reorderLevel) {
      return 'warning'; // Low Stock
    } else {
      return 'success'; // In Stock
    }
  };

  const saveChanges = async () => {
    const status = determineStatus(parseInt(formData.stock), parseInt(formData.reorderLevel));
    try {
      const response = await axios.put(`http://localhost:8080/inventory/${selectedProduct.ID}`, {
        stock: parseInt(formData.stock),
        reorderLevel: parseInt(formData.reorderLevel)
      });
      console.log('Update response:', response.data);
      setInventoryData(inventoryData.map(item =>
        item.ID === selectedProduct.ID ? { ...item, Stock: formData.stock, ReorderLevel: formData.reorderLevel, Status: status } : item
      ));
      setViewEditModal(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const addInventory = async () => {
    console.log('Product ID:', formData.productId, 'Stock:', formData.stock, 'Reorder Level:', formData.reorderLevel);
    try {
      const response = await axios.post('http://localhost:8080/inventory', {
        productID: parseInt(formData.productId),
        stock: parseInt(formData.stock),
        reorderLevel: parseInt(formData.reorderLevel)
      });
      setInventoryData([...inventoryData, response.data]);
      setAddModal(false);
      setFormDataAddInven({
        productId: '',
        stock: '',
        reorderLevel: ''
      });
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  };

  

  return (
    <>
      <CCard>
        <CCardHeader>
          Inventory
          <CButton color="primary" className="float-end" onClick={() => setAddModal(true)}>Add Inventory</CButton>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="text-center"> 
                  <CIcon icon={cilListRich} />
                </CTableHeaderCell>
                <CTableHeaderCell>Product Name</CTableHeaderCell>
                <CTableHeaderCell>Category</CTableHeaderCell>
                <CTableHeaderCell>Stock</CTableHeaderCell>
                <CTableHeaderCell>Reorder Level</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {inventoryData.map((item, index) => (
                 <CTableRow v-for="invenItem in tableItems" key={index}> 
                    <CTableDataCell className="text-center">
                      <CAvatar
                        size="md"
                        src={`https://ui-avatars.com/api/?background=random&rounded=true&bold=true&name=${index+1}`}
                      />
                    </CTableDataCell>
                  <CTableDataCell>{item.productName}</CTableDataCell>
                  <CTableDataCell>{item.category}</CTableDataCell>
                  <CTableDataCell>{item.Stock}</CTableDataCell>
                  <CTableDataCell>{item.ReorderLevel}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getStatusBadge(item.Stock, item.ReorderLevel)}>
                        {getStatusText(item.Stock, item.ReorderLevel)}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" size="sm" onClick={() => handleViewEdit(item)}>
                      View
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

        {/* Add Inventory Modal */}
        <CModal visible={addModal} onClose={() => setAddModal(false)}>
        <CModalHeader onClose={() => setAddModal(false)}>Add Inventory</CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="productId">Product</CFormLabel>
              <CFormSelect id="productId" name="productId" value={formData.productId} onChange={handleInputChange}>
                <option value="">Select a Product</option>
                {products.map((product) => (
                  <option key={product.ID} value={product.ID}>{product.Name}</option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="stock">Stock</CFormLabel>
              <CFormInput type="number" id="stock" name="stock" value={formData.stock} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="reorderLevel">Reorder Level</CFormLabel>
              <CFormInput type="number" id="reorderLevel" name="reorderLevel" value={formData.reorderLevel} onChange={handleInputChange} />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={addInventory}>Add</CButton>
          <CButton color="secondary" onClick={() => setAddModal(false)}>Cancel</CButton>
        </CModalFooter>
      </CModal>


      {/* View/Edit Modal */}
      <CModal visible={viewEditModal} onClose={() => setViewEditModal(false)}>
        <CModalHeader onClose={() => setViewEditModal(false)}>
          View/Edit Product Details
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormLabel htmlFor="productName">Product Name</CFormLabel>
              <CFormInput
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="category">Category</CFormLabel>
              <CFormInput
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="price">Price</CFormLabel>
              <CFormInput
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="stock">Stock</CFormLabel>
              <CFormInput
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="reorderLevel">Reorder Level</CFormLabel>
              <CFormInput
                type="number"
                id="reorderLevel"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={saveChanges}>
            Save
          </CButton>
          <CButton color="secondary" onClick={() => setViewEditModal(false)}>
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
          Are you sure you want to delete {selectedProduct && selectedProduct.productName}?
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

export default Inventory;