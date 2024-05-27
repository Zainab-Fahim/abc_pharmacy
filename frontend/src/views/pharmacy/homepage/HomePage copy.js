import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'

function HomePage() {
  return (
    <div>
      <CCard>
        <CCardHeader>Dashboard Overview</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6" lg="3">
              <div className="info-box bg-info">
                <span className="info-box-icon">
                  <i className="fas fa-shopping-cart"></i>
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Total Sales</span>
                  <span className="info-box-number">1,410</span>
                </div>
              </div>
            </CCol>
            <CCol sm="6" lg="3">
              <div className="info-box bg-success">
                <span className="info-box-icon">
                  <i className="fas fa-user"></i>
                </span>
                <div className="info-box-content">
                  <span className="info-box-text">Total Customers</span>
                  <span className="info-box-number">410</span>
                </div>
              </div>
            </CCol>
          </CRow>
          <CChartBar
            datasets={[
              {
                label: 'Sales',
                backgroundColor: '#f87979',
                data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
              },
            ]}
            labels="months"
            options={{
              tooltips: {
                enabled: true,
              },
            }}
          />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>Recent Orders</CCardHeader>
        <CCardBody>
          <table className="table table-hover table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1234</td>
                <td>John Doe</td>
                <td>2024-05-22</td>
                <td>
                  <span className="badge badge-success">Completed</span>
                </td>
                <td>$150.00</td>
              </tr>
              <tr>
                <td>1235</td>
                <td>Jane Doe</td>
                <td>2024-05-21</td>
                <td>
                  <span className="badge badge-warning">Pending</span>
                </td>
                <td>$200.00</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>Low Stock Alerts</CCardHeader>
        <CCardBody>
          <table className="table table-hover table-outline mb-0 d-none d-sm-table">
            <thead className="thead-light">
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>5678</td>
                <td>Aspirin</td>
                <td>15</td>
                <td>50</td>
              </tr>
              <tr>
                <td>5679</td>
                <td>Ibuprofen</td>
                <td>8</td>
                <td>30</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default HomePage
