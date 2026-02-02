import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/AdminDashboard';
import BookingPage from './pages/BookingPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOTP from './pages/VerifyOTP';

import MovieDetails from './pages/MovieDetails';
import MyBookings from './pages/MyBookings';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;