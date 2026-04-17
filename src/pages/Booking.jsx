import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { events } from "../data/eventData";
import { db } from "../Firebase/Firebase";
console.log("DB CHECK:", db);
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Form,
  FloatingLabel,
} from "react-bootstrap";

import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiClock } from "react-icons/fi";
import { authContext } from "../components/context/AuthContext";
import "./booking.css";

const EventBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading } = useContext(authContext);

  const selectedEvent = events.find((e) => e.id === Number(id));

  // Compute dynamic status
  const today = new Date();
  today.setHours(0,0,0,0);
  const evDate = selectedEvent ? new Date(selectedEvent.date) : new Date();
  const isExpired = evDate < today;
  const isSoldOut = selectedEvent ? (selectedEvent.bookedCount >= selectedEvent.capacity) : false;
  const isBookingDisabled = isExpired || isSoldOut;

  // DEFAULT FIXED EVENT DATE
  const getFixedEventDate = () => {
    if (!selectedEvent) return "TBD";
    return new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ticketQuantity: 1,
    specialRequest: "",
    grandTotal: 0,
  });

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/Auth");
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user, loading, navigate]);

  // ✅ Calculate total based on ticket quantity and event price
  useEffect(() => {
    if (selectedEvent) {
      setFormData((prev) => ({
        ...prev,
        grandTotal: prev.ticketQuantity * selectedEvent.price,
      }));
    }
  }, [formData.ticketQuantity, selectedEvent]);

  const handleChange = (field, e) => {
    const value =
      field === "ticketQuantity" ? Number(e.target.value) : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ SUBMIT FUNCTION - Fixed event date, no date selection
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("EVENT BOOKING SUBMISSION");

    if (!user) {
      alert("Login First");
      return;
    }

    try {
      const fixedEventDate = getFixedEventDate();
      
      const docRef = await addDoc(collection(db, "booking"), {
        ...formData,
        eventId: id,
        eventName: selectedEvent.name,
        eventPrice: selectedEvent.price,
        eventVenue: selectedEvent.venue,
        eventCategory: selectedEvent.category || "Event",
        eventDate: fixedEventDate,
        eventImage: selectedEvent.image,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: "Pending",
      });

      console.log("Event Booked:", docRef.id);

      alert("Event Ticket Purchased Successfully ✅");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.log("BOOKING ERROR:", error);
      alert(error.message);
    }
  };

  // ⏳ Loading
  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  // ❌ Event not found
  if (!selectedEvent) {
    return (
      <Container className="mt-5 text-center">
        <Card className="p-4 shadow">
          <h4>Event Not Found</h4>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </Container>
    );
  }

  const fixedEventDate = getFixedEventDate();
  const eventDateTime = `${fixedEventDate} | 6:00 PM - 11:00 PM`;

  return (
    <Container className="mt-5">
      <Row>
        {/* LEFT SIDE - EVENT DETAILS */}
        <Col md={6}>
          <Card className="shadow rounded-4 event-details-card">
            <Card.Img
              src={selectedEvent.image}
              style={{ height: "400px", objectFit: "cover" }}
              alt={selectedEvent.name}
            />
            <Card.Body className="event-details-body">
              <Card.Title className="event-title">{selectedEvent.name}</Card.Title>
              
              <div className="event-meta-info">
                <div className="meta-item">
                  <FiMapPin className="meta-icon" />
                  <span>{selectedEvent.venue}</span>
                </div>
                <div className="meta-item">
                  <FiCalendar className="meta-icon" />
                  <span>{fixedEventDate}</span>
                </div>
                <div className="meta-item">
                  <FiClock className="meta-icon" />
                  <span>6:00 PM - 11:00 PM</span>
                </div>
              </div>

              <div className="event-badges">
                <Badge bg="primary" className="event-badge">{selectedEvent.duration}</Badge>
                <Badge bg="secondary" className="event-badge">{selectedEvent.rating}</Badge>
                <Badge bg="success" className="ticket-price-badge">₹{selectedEvent.price}</Badge>
              </div>

              <div className="event-description">
                <h6>About This Event</h6>
                <p>{selectedEvent.overview || "Experience an amazing event with great entertainment and networking opportunities."}</p>
              </div>

              <div className="event-highlights">
                <h6>Event Highlights</h6>
                <ul>
                  {(selectedEvent.highlights || []).slice(0, 4).map((highlight, idx) => (
                    <li key={idx}>✓ {highlight}</li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT SIDE - BOOKING FORM */}
        <Col md={6}>
          <Card className="p-4 shadow rounded-4 booking-form-card">
            <h4 className="text-center mb-4 form-title">Purchase Event Tickets</h4>

            <Form onSubmit={handleSubmit} className="event-booking-form">
              <FloatingLabel label="Full Name" className="mb-3">
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e)}
                  required
                  placeholder="Enter your name"
                />
              </FloatingLabel>

              <FloatingLabel label="Email Address" className="mb-3">
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e)}
                  required
                  placeholder="Enter your email"
                />
              </FloatingLabel>

              <FloatingLabel label="Phone Number" className="mb-3">
                <Form.Control
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e)}
                  required
                  placeholder="Enter your phone"
                />
              </FloatingLabel>

              {/* FIXED EVENT DATE - READ ONLY */}
              <div className="mb-3 fixed-event-date">
                <label className="form-label">Event Date (Fixed)</label>
                <Form.Control
                  type="text"
                  value={fixedEventDate}
                  readOnly
                  className="event-date-display"
                />
              </div>

              <FloatingLabel label="Number of Tickets" className="mb-3">
                <Form.Control
                  type="number"
                  min="1"
                  max="10"
                  value={formData.ticketQuantity}
                  onChange={(e) => handleChange("ticketQuantity", e)}
                  disabled={isBookingDisabled}
                  required
                />
              </FloatingLabel>

              <FloatingLabel label="Special Requests (Optional)" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.specialRequest}
                  onChange={(e) => handleChange("specialRequest", e)}
                  placeholder="Any special requirements?"
                />
              </FloatingLabel>

              {/* PRICE BREAKDOWN */}
              <div className="price-breakdown mb-4">
                <div className="price-row">
                  <span>Ticket Price</span>
                  <span>₹{selectedEvent.price.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span>Quantity</span>
                  <span>x {formData.ticketQuantity}</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount</span>
                  <span className="total-amount">₹{formData.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button type="submit" variant="success" size="lg" className="btn-confirm-booking" disabled={isBookingDisabled}>
                  {isExpired ? "Event Expired" : isSoldOut ? "Tickets Sold Out" : <><FiDollarSign /> Confirm & Pay ₹{formData.grandTotal.toLocaleString()}</>}
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </Form>

            <div className="booking-security mt-4">
              <p className="security-text">🔒 Secure payment • 100% refundable • No hidden charges</p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EventBooking;