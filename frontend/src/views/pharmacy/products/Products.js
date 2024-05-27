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
import { cilPuzzle } from '@coreui/icons'

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewEditModal, setViewEditModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [analyticsModal, setAnalyticsModal] = useState(false);

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    price: '',
  });
  useEffect(() => {
    if (selectedProduct && selectedProduct.ID) {
      fetchOrderDetails(selectedProduct.ID);
    }
  }, [selectedProduct]);
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const updateProduct = async () => {
    if (!selectedProduct || !selectedProduct.ID) {
        console.error("No product selected for update");
        return;
    }
    console.log('Selected product:', selectedProduct.ID);
    try {
        const response = await axios.put(`http://localhost:8080/products/${selectedProduct.ID}`, {
            Name: formData.productName,
            Category: formData.category,
            Price: parseFloat(formData.price)  // Ensure price is sent as a float
        });

        const updatedProduct = response.data;
        const updatedProducts = products.map(product =>
            product.ID === updatedProduct.ID ? updatedProduct : product
        );
        setProducts(updatedProducts);
        setViewEditModal(false); // Close the modal after saving
    } catch (error) {
        console.error('Error updating product:', error);
        alert("Failed to update product");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeEditModal = () => {
    setViewEditModal(false);
    setFormData({
        productName: '',
        category: '',
        price: ''
    });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    console.log('Selected product:', product);
    setFormData({
      productName: product.Name, // Make sure these property names exactly match the data properties
      category: product.Category,
      price: product.Price.toString(), // Convert price to string if it's not
    });
    setViewEditModal(true); // Open the modal
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/products/${selectedProduct.ID}`);
      setProducts(products.filter(item => item.ID !== selectedProduct.ID));
      setDeleteModal(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const fetchOrderDetails = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/orderdetails/product/${productId}`);
      const details = await response.data;
      setOrderDetails(details);
      if (details.length > 0) {
        setAnalyticsModal(true);  // Only open modal if there are details
      } else {
        alert("No order details available for this product.");
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleAnalytics = (product) => {
    console.log("Handling analytics for product: ", product);
    if (!product || typeof product.ID === 'undefined') {
      console.error("Product is undefined or lacks an ID");
      return;
    }
    setSelectedProduct(product);  // Ensure this is synchronous if needed or checked after set
  };
  
  const computeAnalytics = () => {
    const totalQuantity = orderDetails.reduce((acc, detail) => acc + detail.Quantity, 0);
    const totalRevenue = orderDetails.reduce((acc, detail) => acc + (detail.Quantity * detail.PricePerUnit), 0);
    const averagePrice = totalQuantity ? (totalRevenue / totalQuantity).toFixed(2) : 0;

    return { totalQuantity, totalRevenue, averagePrice };
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          Products
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="text-center"> 
                  <CIcon icon={cilPuzzle} />
                </CTableHeaderCell>
                <CTableHeaderCell>Product Name</CTableHeaderCell>
                <CTableHeaderCell>Category</CTableHeaderCell>
                <CTableHeaderCell>Price</CTableHeaderCell>
                <CTableHeaderCell>Analytics</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {products.map((product, index) => (
                  <CTableRow v-for="invenItem in tableItems" key={index}> 
                    <CTableDataCell className="text-center">
                      <CAvatar
                        size="md"
                        src={`https://ui-avatars.com/api/?background=random&rounded=true&bold=true&name=${index+1}`}
                      />
                  </CTableDataCell>
                  <CTableDataCell>{product.Name}</CTableDataCell>
                  <CTableDataCell>{product.Category}</CTableDataCell>
                  <CTableDataCell>{product.Price}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="info" onClick={() => handleAnalytics(product)}>
                      Analytics
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="success" onClick={() => handleEdit(product)}>
                      Edit
                    </CButton>{' '}
                    <CButton color="danger" onClick={() => handleDelete(product)}>
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
          Product Analytics - {selectedProduct ? selectedProduct.Name : 'Loading...'}
        </CModalHeader>
        <CModalBody>
          {orderDetails && orderDetails.length > 0 ? (
            orderDetails.map(detail => (
              <div key={detail.ID}>
                <p>Order ID: {detail.OrderID}</p>
                <p>Quantity: {detail.Quantity}</p>
                <p>Price Per Unit: ${detail.PricePerUnit.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p>No order details available for this product.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAnalyticsModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>


      {/* Edit Modal */}
      <CModal visible={viewEditModal} onClose={closeEditModal}>
        <CModalHeader onClose={() => setFormData(false)}>
          Edit Product
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
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="price">Price</CFormLabel>
              <CFormInput
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={updateProduct}>
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
          Are you sure you want to delete {selectedProduct && selectedProduct.Name}?
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

export default Products;
