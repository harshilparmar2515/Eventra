import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Carousel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiArrowRight,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import { events } from "../data/eventData";
import EventCard from "../components/Cards/EventCard";
import "./home.css";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate ;
const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    // Get 6 featured events (highest rated)
    const featured = events
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 6);
    setFeaturedEvents(featured);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to search results
    window.location.href = `/search?q=${searchQuery}`;
  };

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Organizer",
      image: "https://i.pravatar.cc/150?img=1",
      text: "Eventra made discovering and booking events so easy! The variety of events and seamless booking experience are outstanding.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Music Enthusiast",
      image: "https://i.pravatar.cc/150?img=2",
      text: "The best event booking platform I've used. Great interface, excellent customer support, and amazing event selection!",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Festival Attendee",
      image: "https://i.pravatar.cc/150?img=3",
      text: "Eventra offers premium event experiences at reasonable prices. Highly recommended for anyone looking to discover events.",
      rating: 5,
    },
  ];

  const stats = [
    { icon: FiMapPin, count: "500+", label: "Events" },
    { icon: FiUsers, count: "100K+", label: "Event Attendees" },
    { icon: FiAward, count: "4.8", label: "Avg Rating" },
    { icon: FiTrendingUp, count: "50+", label: "Categories" },
  ];

  return (
    <div className="home-page">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="hero-section">
        <div className="hero-background">
          <video
            autoPlay
            muted
            loop
            className="hero-video"
          >
            <source
              src="Bg-Video.mp4"
              type="video/mp4"
            />
          </video>
          <div className="hero-overlay"></div>
        </div>

        <Container className="hero-content">
          <div className="hero-text animate-fade-in-up">
            <h1 className="hero-title">Discover Amazing Events</h1>
            <p className="hero-subtitle">
              Find concerts, conferences, festivals, and experiences. Your next event begins here.
            </p>

            {/* Search Bar */}
            <Form onSubmit={handleSearchSubmit} className="search-form">
              <Form.Group className="search-group">
                <div className="search-input-wrapper">
                  <FiSearch className="search-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Search events, venues, categories..."
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="btn-search"
                  onClick={() => navigate("/events")}
                >
                  <span>Discover Events</span>
                  <FiArrowRight />
                </Button>
              </Form.Group>

              {/* Filter Chips */}
              <div className="search-filters">
                <Link to="/events" className="filter-chip">
                  <FiMapPin /> Popular Events
                </Link>
                <Link to="/events" className="filter-chip">
                  <FiCalendar /> This Month
                </Link>
                <Link to="/events" className="filter-chip">
                  <FiUsers /> Music Events
                </Link>
              </div>
            </Form>
          </div>
        </Container>
      </section>

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <section className="stats-section">
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Col lg={3} md={6} sm={6} key={index}>
                  <div className="stat-card animate-fade-in">
                    <div className="stat-icon">
                      <Icon />
                    </div>
                    <h3 className="stat-count">{stat.count}</h3>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* ============================================
          FEATURED EVENTS SECTION
          ============================================ */}
      <section className="featured-section">
        <Container>
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">
              Handpicked events and experiences from around the world
            </p>
            <Button
              as={Link}
              to="/events"
              className="btn-view-all"
            >
              View All Events <FiArrowRight />
            </Button>
          </div>

          <Row className="trips-grid g-4">
            {featuredEvents.map((event) => (
              <Col lg={12} md={6} sm={12} key={event.id} className="animate-fade-in">
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ============================================
          WHY CHOOSE US SECTION
          ============================================ */}
      <section className="why-us-section">
        <Container>
          <div className="section-header animate-fade-in">
            <h2 className="section-title text-white">Why Choose Eventra?</h2>
            <p className="section-subtitle text-light">
              We provide the best event experiences with unmatched quality and value
            </p>
          </div>

          <Row className="g-4">
            {[
              {
                icon: "🎪",
                title: "Diverse Events",
                desc: "Access thousands of events across music, tech, sports, and more",
              },
              {
                icon: "🛡️",
                title: "Safe & Secure",
                desc: "100% secure booking with verified event organizers",
              },
              {
                icon: "👥",
                title: "Expert Support",
                desc: "24/7 customer support for all your event booking needs",
              },
              {
                icon: "🎯",
                title: "Curated Selection",
                desc: "Hand-picked events for unforgettable experiences",
              },
              {
                icon: "💳",
                title: "Flexible Payment",
                desc: "Easy payment options and secure transactions",
              },
              {
                icon: "⭐",
                title: "Quality Assured",
                desc: "Highly rated events with 4.8+ average attendee reviews",
              },
            ].map((feature, index) => (
              <Col lg={4} md={6} sm={12} key={index} className="animate-fade-in">
                <Card className="feature-card">
                  <Card.Body>
                    <div className="feature-icon">{feature.icon}</div>
                    <h5 className="feature-title">{feature.title}</h5>
                    <p className="feature-desc">{feature.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ============================================
          TESTIMONIALS SECTION
          ============================================ */}
      <section className="testimonials-section">
        <Container>
          <div className="section-header animate-fade-in">
            <h2 className="section-title">What Our Attendees Say</h2>
            <p className="section-subtitle">
              Real experiences from real event attendees
            </p>
          </div>

          <Carousel className="testimonials-carousel" indicators={false} controls={true}>
            {testimonials.map((testimonial) => (
              <Carousel.Item key={testimonial.id} className="testimonial-item">
                <div className="testimonial-card animate-fade-in">
                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">⭐</span>
                    ))}
                  </div>

                  <p className="testimonial-text">"{testimonial.text}"</p>

                  <div className="testimonial-author">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <h6 className="author-name">{testimonial.name}</h6>
                      <small className="author-role">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="cta-section">
        <div className="cta-background"></div>
        <Container className="cta-content">
          <Row className="align-items-center">
            <Col lg={6} className="animate-slide-in-left">
              <h2 className="cta-title">Ready for Your Next Event?</h2>
              <p className="cta-subtitle">
                Join thousands of attendees who have discovered amazing events with Eventra. Start exploring today.
              </p>

              <div className="cta-buttons">
                <Button as={Link} to="/events" className="btn-primary-large">
                  Explore Events
                </Button>
                <Button as={Link} to="/contact" className="btn-secondary-large">
                  Contact Us
                </Button>
              </div>
            </Col>

            <Col lg={6} className="animate-slide-in-right">
              <div className="cta-form-card">
                <h4 className="form-title">Subscribe to Our Newsletter</h4>
                <p className="form-subtitle">
                  Get exclusive event recommendations delivered to your inbox
                </p>

                <Form className="newsletter-form">
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                  </Form.Group>

                  <Button type="submit" className="btn-subscribe">
                    <FiMail /> Subscribe Now
                  </Button>
                </Form>

                <p className="form-disclaimer">
                  We respect your privacy. No spam, just great event updates.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <section className="faq-section">
        <Container>
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Find answers to common questions about our services
            </p>
          </div>

          {/* Simple FAQ Cards */}
          <Row className="g-4">
            {[
              {
                q: "How do I book an event?",
                a: "Browse our event listings, click on your preferred event, select tickets, and complete the booking process. It's that simple!",
              },
              {
                q: "Can I cancel my tickets?",
                a: "Yes! You can cancel up to 7 days before the event for a full refund. Terms and conditions apply.",
              },
              {
                q: "Are payment plans available?",
                a: "Absolutely! We offer flexible payment plans. You can pay in 3, 6, or 12 installments.",
              },
              {
                q: "Do you provide event cancellation protection?",
                a: "Yes, ticket cancellation protection is available with most bookings. Additional coverage options are also available.",
              },
            ].map((faq, index) => (
              <Col lg={6} key={index} className="animate-fade-in">
                <Card className="faq-card">
                  <Card.Body>
                    <h6 className="faq-question">{faq.q}</h6>
                    <p className="faq-answer">{faq.a}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;