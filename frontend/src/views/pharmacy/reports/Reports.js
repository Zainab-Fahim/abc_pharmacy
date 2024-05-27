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
  CFormSelect,
  CBadge,
} from '@coreui/react';

// Sample report data
const salesReports = [
  {
    id: 1,
    date: '2024-05-01',
    totalSales: '$1500',
    numberOfTransactions: 30,
  },
  {
    id: 2,
    date: '2024-05-02',
    totalSales: '$1800',
    numberOfTransactions: 35,
  },
  {
    id: 3,
    date: '2024-05-03',
    totalSales: '$1200',
    numberOfTransactions: 20,
  },
  {
    id: 4,
    date: '2024-05-04',
    totalSales: '$2000',
    numberOfTransactions: 40,
  },
  {
    id: 5,
    date: '2024-05-05',
    totalSales: '$2200',
    numberOfTransactions: 45,
  },
];

const inventoryReports = [
  {
    id: 1,
    productName: 'Aspirin',
    category: 'Pain Relief',
    stock: 50,
    reorderLevel: 20,
  },
  {
    id: 2,
    productName: 'Ibuprofen',
    category: 'Pain Relief',
    stock: 15,
    reorderLevel: 25,
  },
  // Add more inventory report data as needed
];

const customerReports = [
  {
    id: 1,
    customerName: 'John Doe',
    totalPurchases: '$500',
    lastPurchaseDate: '2024-05-01',
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    totalPurchases: '$800',
    lastPurchaseDate: '2024-05-02',
  },
  // Add more customer report data as needed
];

const Reports = () => {
  const [viewModal, setViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('sales');

  const handleView = (report) => {
    setSelectedReport(report);
    setViewModal(true);
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const renderReportTable = () => {
    let data;
    switch (reportType) {
      case 'sales':
        data = salesReports;
        break;
      case 'inventory':
        data = inventoryReports;
        break;
      case 'customer':
        data = customerReports;
        break;
      default:
        data = [];
    }

    return (
      <CTable hover responsive>
        <CTableHead>
          <CTableRow>
            {Object.keys(data[0]).map((key) => (
              <CTableHeaderCell key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</CTableHeaderCell>
            ))}
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((item) => (
            <CTableRow key={item.id}>
              {Object.values(item).map((value, index) => (
                <CTableDataCell key={index}>{value}</CTableDataCell>
              ))}
              <CTableDataCell>
                <CButton color="primary" size="sm" onClick={() => handleView(item)}>
                  View
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    );
  };

  return (
    <>
      <CCard>
        <CCardHeader>
          Reports
          <CFormSelect
            aria-label="Select report type"
            className="float-end"
            style={{ width: '200px' }}
            onChange={handleReportTypeChange}
          >
            <option value="sales">Sales Reports</option>
            <option value="inventory">Inventory Reports</option>
            <option value="customer">Customer Reports</option>
          </CFormSelect>
        </CCardHeader>
        <CCardBody>
          {renderReportTable()}
        </CCardBody>
      </CCard>

      {/* View Report Modal */}
      <CModal visible={viewModal} onClose={() => setViewModal(false)}>
        <CModalHeader onClose={() => setViewModal(false)}>
          Report Details
        </CModalHeader>
        <CModalBody>
          {selectedReport && (
            <CForm>
              {Object.entries(selectedReport).map(([key, value]) => (
                <div className="mb-3" key={key}>
                  <CFormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</CFormLabel>
                  <CFormInput type="text" value={value} readOnly />
                </div>
              ))}
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Reports;
