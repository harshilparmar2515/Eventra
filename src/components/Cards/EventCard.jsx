import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiStar,
  FiArrowRight,
  FiTrendingUp,
  FiCalendar
} from "react-icons/fi";
import "./eventCard.css";

const EventCard = ({ event, variant = "default" }) => {
  // Format price with commas
  const formattedPrice = `₹${event.price?.toLocaleString() || "0"}`;

  // Extract rating number from string (e.g., "4.8 ⭐" -> 4.8)
  const rating = parseFloat(event.rating?.toString().split(" ")[0]) || 0;

  // Determine Dynamic Status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  
  let statusInfo = { bg: "info", text: "Upcoming", className: "" };
  if (eventDate < today) {
    statusInfo = { bg: "secondary", text: "Expired", className: "" };
  } else if (event.bookedCount >= event.capacity) {
    statusInfo = { bg: "danger", text: "Sold Out", className: "" };
  } else if (eventDate.getTime() === today.getTime()) {
    statusInfo = { bg: "success", text: "Live Now", className: "live-pulse" };
  }

  // Format Date for display
  const dateDisplay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Card className={`trip-card trip-card-${variant} ${statusInfo.text === "Expired" ? "expired-card" : ""}`}>
      {/* Image Container with Overlay */}
      <div className="trip-card-image-wrapper">
        <Card.Img
          variant="top"
          src={event.image}
          alt={event.name}
          className="trip-card-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=Event+Image";
          }}
        />

        {/* Badges Overlay */}
        <div className="trip-card-badges">
          <Badge bg="danger" className="badge-price">
            {formattedPrice}
          </Badge>
          <Badge bg={statusInfo.bg} className={`badge-duration ${statusInfo.className}`}>
            {statusInfo.text === "Live Now" && <span className="live-dot" />}
            {statusInfo.text}
          </Badge>
        </div>

        {/* Dynamic Date Badge */}
        <Badge
          bg="dark"
          className="badge-difficulty date-badge"
        >
          <FiCalendar className="me-1" />
          {dateDisplay}
        </Badge>

        {/* Rating Stars */}
        <div className="trip-card-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={i < Math.floor(rating) ? "filled" : ""}
              />
            ))}
          </div>
          <span className="rating-text">{event.rating}</span>
        </div>
      </div>

      {/* Card Body */}
      <Card.Body className="trip-card-body">
        {/* Title */}
        <Card.Title className="trip-card-title">{event.name}</Card.Title>

        {/* Venue */}
        <div className="trip-card-destination">
          <FiMapPin className="destination-icon" />
          <span>{event.venue}</span>
        </div>

        {/* Overview */}
        <Card.Text className="trip-card-overview">
          {event.overview}
        </Card.Text>

        {/* Highlights Preview */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="trip-card-highlights">
            <small className="highlights-label">Highlights:</small>
            <div className="highlights-list">
              {event.highlights.slice(0, 2).map((highlight, idx) => (
                <span key={idx} className="highlight-tag">
                  {highlight}
                </span>
              ))}
              {event.highlights.length > 2 && (
                <span className="highlight-tag more">
                  +{event.highlights.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </Card.Body>

      {/* Card Footer with CTA Button */}
      <Card.Footer className="trip-card-footer bg-transparent">
        <Button
          as={Link}
          to={`/event/${event.id}`}
          className={`btn-explore ${statusInfo.text === "Sold Out" || statusInfo.text === "Expired" ? "btn-disabled-look" : ""}`}
        >
          <span>{statusInfo.text === "Expired" ? "View Past Event" : "View Event"}</span>
          <FiArrowRight className="btn-icon" />
        </Button>

        {/* Availability indicator */}
        <div className="ticket-availability">
          {statusInfo.text !== "Expired" && statusInfo.text !== "Sold Out" && event.capacity > 0 && (
             <small>{event.capacity - event.bookedCount} tickets left</small>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default EventCard;
