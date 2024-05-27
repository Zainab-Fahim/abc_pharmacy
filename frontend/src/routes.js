import React from 'react'

const Dashboard = React.lazy(() => import('./views/pharmacy/homepage/HomePage'))


//Pharmacy
const Customers = React.lazy(() => import('./views/pharmacy/customers/Customers'))
const Inventory = React.lazy(() => import('./views/pharmacy/inventory/Inventory'))
const Orders = React.lazy(() => import('./views/pharmacy/orders/Orders'))
const Products = React.lazy(() => import('./views/pharmacy/products/Products'))
const HomePage = React.lazy(() => import('./views/pharmacy/homepage/HomePage'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/customers', name: 'Customers', element: Customers },
  { path: '/homepage', name: 'HomePage', element: HomePage },
  { path: '/inventory', name: 'Inventory', element: Inventory },
  { path: '/orders', name: 'Orders', element: Orders },
  { path: '/products', name: 'Products', element: Products },
]

export default routes
