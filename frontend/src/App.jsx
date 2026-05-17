import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Faq from './pages/Faq';
import ShippingPolicy from './pages/ShippingPolicy';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import UsersManagement from './pages/admin/Users';
import Orders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

import SellerDashboard from './pages/SellerDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Routes>
        {}
        <Route path="/" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Home />
            </main>
            <Footer />
          </>
        } />
        <Route path="/products" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <ProductsPage />
            </main>
            <Footer />
          </>
        } />
        <Route path="/product/:id" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <ProductDetail />
            </main>
            <Footer />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Cart />
            </main>
            <Footer />
          </>
        } />
        <Route path="/checkout" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Checkout />
            </main>
            <Footer />
          </>
        } />
        <Route path="/account" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Account />
            </main>
            <Footer />
          </>
        } />
        <Route path="/about" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <About />
            </main>
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Contact />
            </main>
            <Footer />
          </>
        } />
        <Route path="/faq" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Faq />
            </main>
            <Footer />
          </>
        } />
        <Route path="/shipping-policy" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <ShippingPolicy />
            </main>
            <Footer />
          </>
        } />
        <Route path="/terms" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Terms />
            </main>
            <Footer />
          </>
        } />
        <Route path="/privacy" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Privacy />
            </main>
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Login />
            </main>
            <Footer />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <main className="flex-1 w-full">
              <Register />
            </main>
            <Footer />
          </>
        } />

        {}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {}
        <Route path="/seller" element={<SellerDashboard />} />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
export default App;