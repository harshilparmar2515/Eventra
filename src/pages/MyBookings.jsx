import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../components/context/AuthContext";
import { db } from "../Firebase/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Container, Card, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import { FiTrash2, FiChevronRight, FiCheckCircle, FiCalendar, FiMapPin, FiUsers, FiDollarSign } from "react-icons/fi";
import { useToast } from "../components/ToastContext";
import "./myBookings.css";

// Helper function to format dates safely
const formatDate = (dateValue) => {
  if (!dateValue) return "TBD";
  
  // Handle Firestore Timestamp
  if (dateValue?.seconds) {
    try {
      return new Date(dateValue.seconds * 1000).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    } catch (e) {
      return "TBD";
    }
  }
  
  // Handle Date object
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  
  // Handle string
  if (typeof dateValue === "string") {
    try {
      return new Date(dateValue).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    } catch (e) {
      return dateValue;
    }
  }
  
  return "TBD";
};

const MyBookings = () => {
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, "booking"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        const userBookings = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setBookings(userBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        addToast("Unable to load bookings. Try again later.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, addToast]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this event ticket?")) return;

    setRemoving(bookingId);
    try {
      await deleteDoc(doc(db, "booking", bookingId));
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      addToast("Event ticket cancelled successfully.", "success");
    } catch (error) {
      console.error("Cancel booking failed:", error);
      addToast("Failed to cancel ticket. Please try again.", "error");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <Container className="mybookings-page">
      <h1 className="mybookings-title">My Event Tickets</h1>
      <p className="mybookings-subtitle">Manage your registered events and track your attendance.</p>

      {loading ? (
        <div className="mybookings-loading">
          <Spinner animation="border" variant="primary" />
          <span>Loading your tickets...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="mybookings-empty">
          <FiCheckCircle className="mybookings-empty-icon" />
          <h3>No event tickets yet</h3>
          <p>Browse amazing events and book your next unforgettable experience.</p>
          <Button onClick={() => navigate("/events")} className="btn-explore-events">
            Explore Events <FiChevronRight />
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {bookings.map((booking) => {
            const formattedDate = formatDate(booking.eventDate || booking.tripDate);
            const ticketStatus = booking.status || "Pending";
            const ticketQuantity = booking.ticketQuantity || booking.totalAttendees || booking.totalPerson || 1;
            const totalPrice = booking.grandTotal || booking.totalPrice || (booking.eventPrice * ticketQuantity) || 0;
            const eventImage = booking.eventImage || "https://images.pexels.com/photos/3601453/pexels-photo-3601453.jpeg";
            
            return (
              <Col lg={6} key={booking.id}>
                <Card className="event-ticket-card shadow-sm">
                  <div className="ticket-image-container">
                    <img src={eventImage} alt={booking.eventName} className="ticket-image" />
                    <div className="ticket-overlay" />
                    <Badge 
                      pill 
                      bg={ticketStatus === "Confirmed" ? "success" : ticketStatus === "Cancelled" ? "danger" : "warning"} 
                      className="ticket-status-badge"
                    >
                      {ticketStatus}
                    </Badge>
                  </div>

                  <Card.Body className="ticket-body">
                    <div className="ticket-header">
                      <div>
                        <Card.Title className="event-name-ticket">{booking.eventName || booking.tripName || "Event"}</Card.Title>
                        <div className="ticket-venue">
                          <FiMapPin className="ticket-icon" />
                          <span>{booking.eventVenue || booking.tripDestination || booking.destination || "Venue TBD"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-details-grid">
                      <div className="ticket-detail-item">
                        <FiCalendar className="detail-icon" />
                        <div>
                          <small>Event Date</small>
                          <p className="detail-value">{formattedDate}</p>
                        </div>
                      </div>
                      
                      <div className="ticket-detail-item">
                        <FiUsers className="detail-icon" />
                        <div>
                          <small>Tickets</small>
                          <p className="detail-value">{ticketQuantity}</p>
                        </div>
                      </div>

                      <div className="ticket-detail-item">
                        <FiDollarSign className="detail-icon" />
                        <div>
                          <small>Total Paid</small>
                          <p className="detail-value">₹{Number(totalPrice).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="ticket-detail-item">
                        <div>
                          <small>Attendee</small>
                          <p className="detail-value">{booking.name || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-contact-info">
                      <small>📧 {booking.email} | 📱 {booking.phone}</small>
                    </div>

                    <div className="ticket-actions mt-3">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => cancelBooking(booking.id)}
                        disabled={removing === booking.id}
                        className="btn-cancel-ticket"
                      >
                        {removing === booking.id ? "Cancelling..." : <><FiTrash2 /> Cancel</>}
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => navigate(`/event/${booking.eventId}`)}
                        className="btn-view-event"
                      >
                        View Event
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings;