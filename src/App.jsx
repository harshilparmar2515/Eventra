import ModernNavbar from "./components/ModernNavbar";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import EventDetail from "./pages/EventDetail";
import EventListing from "./pages/EventListing";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";
import "./styles/toast.css";
import "./App.css";
import Auth from "./components/Auth/Auth";
import EventBooking from "./pages/Booking";
import ProtectedRoute from "./components/ProtectedRoute";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import { ToastProvider } from "./components/ToastContext";

function App() {
  return (
    <ToastProvider>
      <ModernNavbar />

      <main className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventListing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/event-booking/:id" element={<ProtectedRoute><EventBooking /></ProtectedRoute>} />
          <Route path="/booking/:id" element={<ProtectedRoute><EventBooking /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />
    </ToastProvider>
  );
}

export default App;