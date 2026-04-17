import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiClock,
  FiArrowRight,
  FiMusic,
  FiAward,
  FiTarget,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import "./BookingCard.css";

// Helper function to format Firestore timestamps
const formatTimestamp = (value) => {
  if (!value) return "—";
  
  // Handle Firestore Timestamp object {seconds, nanoseconds}
  if (value?.seconds) {
    try {
      const date = new Date(value.seconds * 1000);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
      return "—";
    }
  }
  
  // Handle Date object
  if (value instanceof Date) {
    return value.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  
  // Handle string
  if (typeof value === "string") {
    try {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      }
    } catch (e) {}
  }
  
  return "—";
};

// Helper function to detect event category based on event name
const getEventCategory = (eventName = "") => {
  const nameLower = eventName.toLowerCase();
  
  if (nameLower.includes("music") || nameLower.includes("concert") || nameLower.includes("festival")) {
    return { category: "Music Festival", icon: "🎵", color: "primary" };
  } else if (nameLower.includes("marathon") || nameLower.includes("championship") || nameLower.includes("diving")) {
    return { category: "Sports", icon: "🏆", color: "success" };
  } else if (nameLower.includes("summit") || nameLower.includes("conference") || nameLower.includes("expo") || nameLower.includes("convention")) {
    return { category: "Seminar", icon: "🎯", color: "info" };
  } else if (nameLower.includes("film")) {
    return { category: "Film Festival", icon: "🎬", color: "warning" };
  } else if (nameLower.includes("art") || nameLower.includes("exhibition")) {
    return { category: "Art Exhibition", icon: "🎨", color: "danger" };
  } else if (nameLower.includes("fashion") || nameLower.includes("design")) {
    return { category: "Fashion/Design", icon: "👗", color: "info" };
  } else if (nameLower.includes("yoga") || nameLower.includes("wellness") || nameLower.includes("retreat")) {
    return { category: "Wellness", icon: "🧘", color: "success" };
  } else if (nameLower.includes("wedding")) {
    return { category: "Wedding Expo", icon: "💒", color: "danger" };
  } else if (nameLower.includes("food") || nameLower.includes("carnival")) {
    return { category: "Party", icon: "🎉", color: "warning" };
  } else if (nameLower.includes("anime") || nameLower.includes("convention")) {
    return { category: "Convention", icon: "🎎", color: "primary" };
  } else if (nameLower.includes("literature") || nameLower.includes("book")) {
    return { category: "Book Event", icon: "📚", color: "info" };
  } else if (nameLower.includes("tech") || nameLower.includes("startup")) {
    return { category: "Tech Event", icon: "💻", color: "info" };
  } else if (nameLower.includes("cultural")) {
    return { category: "Cultural Event", icon: "🌍", color: "warning" };
  } else if (nameLower.includes("jazz")) {
    return { category: "Music Festival", icon: "🎷", color: "primary" };
  }
  
  return { category: "Event", icon: "🎪", color: "secondary" };
};

// Helper to check if date is in future
const isFutureEvent = (eventDate) => {
  const date = formatTimestamp(eventDate);
  if (date === "—") return true; // assume future if unknown
  try {
    const eventTime = new Date(date).getTime();
    return eventTime > new Date().getTime();
  } catch {
    return true;
  }
};

const BookingCard = ({ booking, isCancelled, onCancel, onPayNow }) => {
  const status = isCancelled ? "Cancelled" : booking.status || "Pending";
  const eventInfo = getEventCategory(booking.eventName || booking.tripName || "Event");
  const totalPrice = booking.grandTotal ?? booking.totalPrice ?? booking.price ?? 0;
  const ticketQuantity = booking.ticketQuantity ?? booking.totalAttendees ?? booking.totalPerson ?? 1;
  const dateValue = formatTimestamp(booking.eventDate || booking.tripDate || booking.date) || "TBD";
  const bookedOn = formatTimestamp(booking.createdAt || booking.bookedAt || booking.bookedDate);
  const imageUrl = booking.eventImage || booking.image || booking.previewImage || booking.photoUrl || "https://images.pexels.com/photos/3601453/pexels-photo-3601453.jpeg";
  const isFuture = isFutureEvent(booking.eventDate || booking.tripDate || booking.date);

  const timelineSteps = [
    { label: "Booked", active: true },
    { label: "Confirmed", active: status === "Confirmed" || status === "Cancelled" },
    { label: "Attended", active: status === "Confirmed" && isFuture },
  ];

  const isPaid = status === "Confirmed";
  const payDisabled = isCancelled || isPaid;

  return (
    <Card className="event-booking-card shadow-sm">
      <div className="event-card-image-container">
        <div className="event-card-image" style={{ backgroundImage: `url(${imageUrl})` }} />
        <div className="event-card-image-overlay" />
        <div className="event-card-badges-top">
          <Badge bg={eventInfo.color} className="event-category-badge">
            {eventInfo.icon} {eventInfo.category}
          </Badge>
          <Badge
            pill
            bg={
              status === "Cancelled"
                ? "danger"
                : status === "Confirmed"
                ? "success"
                : "warning"
            }
            className="ticket-status-badge"
          >
            {status === "Cancelled" ? "❌ Cancelled" : status === "Confirmed" ? "✓ Confirmed" : "⏳ Pending"}
          </Badge>
        </div>
      </div>

      <Card.Body className="event-card-body">
        <div className="event-card-heading">
          <div>
            <Card.Title className="event-name-card">{booking.eventName || booking.tripName || "Event"}</Card.Title>
            <div className="event-card-venue">
              <FiMapPin className="venue-icon" />
              <span className="venue-text">{booking.eventVenue || booking.tripDestination || booking.destination || "Venue TBD"}</span>
            </div>
          </div>
        </div>

        <div className="event-card-details-grid">
          <div className="event-detail-item">
            <FiCalendar className="detail-icon calendar-icon" />
            <div>
              <small className="detail-label">Event Date</small>
              <p className="detail-value">{dateValue}</p>
            </div>
          </div>

          <div className="event-detail-item">
            <FiClock className="detail-icon clock-icon" />
            <div>
              <small className="detail-label">Time</small>
              <p className="detail-value">6:00 PM - 11:00 PM</p>
            </div>
          </div>

          <div className="event-detail-item">
            <FiUsers className="detail-icon users-icon" />
            <div>
              <small className="detail-label">Tickets</small>
              <p className="detail-value">{ticketQuantity} {ticketQuantity === 1 ? "ticket" : "tickets"}</p>
            </div>
          </div>

          <div className="event-detail-item">
            <FiDollarSign className="detail-icon price-icon" />
            <div>
              <small className="detail-label">Total Amount</small>
              <p className="detail-value ticket-price">₹{Number(totalPrice).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="event-booking-timeline">
          {timelineSteps.map((step) => (
            <div key={step.label} className={`timeline-item ${step.active ? "active" : ""}`}>
              <span className="timeline-dot" />
              <small className="timeline-label">{step.label}</small>
            </div>
          ))}
        </div>

        <div className="event-card-meta">
          <small>Booked on: {bookedOn}</small>
        </div>

        <div className="event-card-actions">
          <Button
            variant={isCancelled ? "secondary" : "outline-danger"}
            onClick={() => onCancel(booking.id)}
            disabled={isCancelled}
            className="btn-action-cancel"
            size="sm"
          >
            {isCancelled ? "Cancelled" : "Cancel Ticket"}
          </Button>
          {payDisabled ? (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  {isCancelled
                    ? "Cancelled tickets cannot be paid"
                    : "This booking is already confirmed."}
                </Tooltip>
              }
            >
              <span className="d-inline-block flex-grow-1">
                <Button
                  variant="primary"
                  disabled
                  className="btn-pay-now w-100"
                  size="sm"
                >
                  <FiCheckCircle /> Confirmed
                </Button>
              </span>
            </OverlayTrigger>
          ) : (
            <Button
              variant="success"
              onClick={() => onPayNow(booking)}
              className="btn-pay-now w-100"
              size="sm"
            >
              Pay Now <FiArrowRight className="ms-1" />
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookingCard;
