import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import img1 from '../img/img (1).jpeg';
import img2 from '../img/img (2).jpeg';
import img3 from '../img/img (3).jpeg';
import img from './Function.jpeg';
import img4 from '../img/img (4).jpeg';
import funeral from './funeral.jpeg'
import Function from './Functions.jpeg';
import 'loading-attribute-polyfill';
import banner1 from './kovaisWebBanner/1.jpg';
import banner2 from './kovaisWebBanner/2.jpg';
import banner3 from './kovaisWebBanner/3.png';
import testimonial1 from '../img/testimonial1.png';
import testimonial2 from '../img/testimonial2.png';
import testimonial3 from '../img/testimonial3.png';
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaStar, FaDownload, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import '../Carousel.css'
import "./Home.css";
import { FaClock, FaUsers, FaHeart, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarker, FaLeaf, FaAward, FaShieldAlt, FaHotel, FaSpa, FaDumbbell, FaCut, FaGlassCheers } from "react-icons/fa";

// Counter animation hook
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, target, duration]);

  return { count, ref };
}

// Stat Item Component - memoized to prevent unnecessary re-renders
const StatItem = React.memo(function StatItem({ value, suffix, label, icon }) {
  const numericValue = parseInt(value);
  const { count, ref } = useCounter(numericValue);

  return (
    <div ref={ref} className="stat-item">
      <div className="stat-icon">{icon}</div>
      <h3 className="stat-number">
        {count}{suffix}
      </h3>
      <p className="stat-label">{label}</p>
    </div>
  );
});

function Home({ user }) {
  const navigate = useNavigate();
  const currentUser = user || JSON.parse(localStorage.getItem("loggedInUser"));
  const [activeService, setActiveService] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, -80]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleNavigation = (path) => navigate(path);

  useEffect(() => {
    // Preload critical images for better performance
    const preloadImages = [banner2, banner3];
    preloadImages.forEach(src => {
      const imgEl = new Image();
      imgEl.src = src;
    });
  }, []);

  // Memoize static data to prevent unnecessary re-renders
  const testimonials = useMemo(() => [
    { id: 1, name: "Rajesh Kumar", role: "Hotel Guest", comment: "An unparalleled experience. The staff anticipated every need before I even asked. This is what true luxury feels like.", rating: 5, image: testimonial1 },
    { id: 2, name: "Priya Suresh", role: "Spa Client", comment: "The spa treatments left me completely rejuvenated. The ambiance, the therapists, the products — absolutely world-class.", rating: 5, image: testimonial2 },
    { id: 3, name: "Vikram Mohan", role: "Regular Member", comment: "I've been coming to Kovais for two years. The consistency of quality and the personal attention keeps me coming back.", rating: 5, image: testimonial3 },
  ], []);

  const services = useMemo(() => [
    { title: "Luxury Hotel", shortDesc: "Book your sanctuary.", fullDesc: "Experience world-class comfort in our meticulously curated rooms. Every detail has been thoughtfully designed to provide an unparalleled stay.", image: img1, path: "/search-results", tag: "Accommodation" },
    { title: "Wellness Spa", shortDesc: "Restore your essence.", fullDesc: "Immerse yourself in therapeutic rituals drawn from ancient traditions. Our expert therapists craft bespoke treatments for your complete renewal.", image: img2, path: "/spa", tag: "Wellness" },
    { title: "Fitness Studio", shortDesc: "Elevate your form.", fullDesc: "State-of-the-art equipment meets elite personal training. Achieve your peak performance in our premium fitness environment.", image: img4, path: "/gym", tag: "Fitness" },
    { title: "Grooming Salon", shortDesc: "Refine your look.", fullDesc: "Master barbers blend classic techniques with contemporary styles. Step in, transform, and step out as the best version of yourself.", image: img3, path: "/barber", tag: "Grooming" },
    { title: "Funeral Service", shortDesc: "Dignified, compassionate care.", fullDesc: "Providing respectful and compassionate grooming services during mourning periods, at your home or our salon, with the utmost sensitivity.", image: funeral, path: "/funeral", tag: "Special Care" },
    { title: "Function Service", shortDesc: "Celebrate in style.", fullDesc: "Look your absolute finest for life's most memorable occasions. Our function grooming service ensures you are impeccably presented.", image: Function, path: "/function", tag: "Events" },
  ], []);

  const scrollToOffer = () => {
    document.getElementById('bookings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const galleryItems = useMemo(() => [
    { image: img1, caption: "Grand Suite" },
    { image: img2, caption: "Spa Retreat" },
    { image: img3, caption: "Grooming Studio" },
    { image: img4, caption: "Fitness Centre" },
    { image: funeral, caption: "Special Services" },
    { image: Function, caption: "Function Prep" },
  ], []);

  const processSteps = useMemo(() => [
    { step: "01", title: "Choose Your Service", desc: "Browse our curated range of luxury services and select what speaks to you." },
    { step: "02", title: "Book Your Slot", desc: "Pick a convenient time with our seamless online booking system." },
    { step: "03", title: "Arrive & Unwind", desc: "Walk in and let our expert team take care of everything else." },
    { step: "04", title: "Leave Transformed", desc: "Depart refreshed, refined, and ready to conquer the world." },
  ], []);

  const awards = useMemo(() => [
    { icon: <FaAward size={28} />, title: "Best Luxury Salon", year: "2023", org: "Tamil Nadu Hospitality Awards" },
    { icon: <FaShieldAlt size={28} />, title: "Excellence in Service", year: "2022", org: "South India Wellness Council" },
    { icon: <FaLeaf size={28} />, title: "Eco-Friendly Practices", year: "2023", org: "Green Business Initiative" },
  ], []);

  return (
    <>
      {/* ─── HERO CAROUSEL ─── */}
      <section className="hero-section" id="home">
        <Carousel
          className="hero-carousel"
          interval={4500}
          pause={false}
          controls
          indicators
          activeIndex={carouselIndex}
          onSelect={setCarouselIndex}
        >
          {[banner1, banner2, banner3].map((banner, i) => (
            <Carousel.Item key={i}>
              <div className="hero-slide">
                <img
                  className="hero-img"
                  src={banner}
                  alt={`Kovais Banner ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchpriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                />
                <div className="hero-overlay" />
                <div className="hero-caption">
                  <motion.span
                    className="hero-eyebrow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                  >
                    Est. 2014 · Coimbatore's Finest
                  </motion.span>
                  <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Where Luxury <br />Meets <em>Wellness</em>
                  </motion.h1>
                  <motion.p
                    className="hero-subtitle"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                  >
                    Premium hospitality, spa, grooming & fitness — all under one roof.
                  </motion.p>
                  <motion.div
                    className="hero-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <button className="btn-hero-primary" onClick={scrollToOffer}>
                      Book a Service <FaArrowRight style={{ marginLeft: 8 }} />
                    </button>
                    <button className="btn-hero-secondary" onClick={() => handleNavigation('/contact')}>
                      Contact Us
                    </button>
                  </motion.div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-dot" />
        </div>
      </section>

      <div className="marquee-strip">
        <div className="marquee-track">
          {[
            { name: "Luxury Hotel", path: "/search-results", icon: <FaHotel /> },
            { name: "Wellness Spa", path: "/spa", icon: <FaSpa /> },
            { name: "Fitness Studio", path: "/gym", icon: <FaDumbbell /> },
            { name: "Master Grooming", path: "/barber", icon: <FaCut /> },
            { name: "Special Care", path: "/funeral", icon: <FaShieldAlt /> },
            { name: "Function Services", path: "/function", icon: <FaGlassCheers /> },
            { name: "Luxury Hotel", path: "/search-results", icon: <FaHotel /> },
            { name: "Wellness Spa", path: "/spa", icon: <FaSpa /> },
            { name: "Fitness Studio", path: "/gym", icon: <FaDumbbell /> },
            { name: "Master Grooming", path: "/barber", icon: <FaCut /> },
            { name: "Special Care", path: "/funeral", icon: <FaShieldAlt /> },
            { name: "Function Services", path: "/function", icon: <FaGlassCheers /> }
          ].map((item, i) => (
            <span key={i} className="marquee-item" onClick={() => handleNavigation(item.path)} style={{ cursor: 'pointer' }}>
              <span className="marquee-icon">{item.icon}</span>
              <span className="marquee-text">{item.name}</span>
              <span className="marquee-separator">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── WHY KOVAIS ─── */}
      <section className="why-section py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <div data-aos="fade-right">
                <span className="section-tag">Our Story</span>
                <h2 className="section-heading mt-2">
                  A Decade of <span className="accent-text">Exceptional</span> Service
                </h2>
                <p className="section-body">
                  Since 2014, Kovais has redefined luxury in Coimbatore. We believe every visit should leave you feeling elevated — not just served. Our philosophy blends warm Tamil hospitality with world-class standards.
                </p>
                <div className="feature-grid mt-4">
                  {[
                    { icon: <FaStar />, title: "Premium Quality", desc: "Only the finest products and techniques" },
                    { icon: <FaClock />, title: "Always Available", desc: "Round-the-clock service excellence" },
                    { icon: <FaUsers />, title: "Expert Professionals", desc: "Trained & certified specialists" },
                    { icon: <FaHeart />, title: "Guest First", desc: "Your comfort is our obsession" },
                  ].map((f, i) => (
                    <motion.div
                      key={i}
                      className="feature-pill"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.12, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <span className="feature-pill-icon">{f.icon}</span>
                      <div>
                        <strong>{f.title}</strong>
                        <p>{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg={7}>
              <div className="stats-card-grid" data-aos="fade-left">
                <StatItem value={10} suffix="+" label="Years of Excellence" icon={<FaAward />} />
                <StatItem value={5000} suffix="+" label="Happy Guests" icon={<FaUsers />} />
                <StatItem value={6} suffix="" label="Premium Services" icon={<FaStar />} />
                <StatItem value={24} suffix="/7" label="Always Open" icon={<FaClock />} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="services-section py-5" id="bookings">
        <Container fluid="xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-heading mt-2">
              Our Premium <span className="accent-text">Services</span>
            </h2>
            <p className="section-subheading">
              Curated experiences designed to exceed every expectation
            </p>
          </div>

          <Row className="g-4">
            {services.map((service, index) => (
              <Col xl={4} lg={4} md={6} sm={12} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="h-100"
                >
                  <div
                    className={`service-card-new h-100 ${activeService === index ? 'active' : ''}`}
                    onClick={() => handleNavigation(service.path)}
                    onMouseEnter={() => setActiveService(index)}
                    onMouseLeave={() => setActiveService(null)}
                  >
                    <div className="service-img-wrap">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="service-img-new"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="service-tag-badge">{service.tag}</span>
                      <div className="service-img-overlay" />
                    </div>
                    <div className="service-body">
                      <h4 className="service-title-new">{service.title}</h4>
                      <p className="service-desc-new">{service.fullDesc}</p>
                      <button className="service-cta">
                        Book Now <FaChevronRight size={12} style={{ marginLeft: 6 }} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="process-section py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-tag">Simple & Seamless</span>
            <h2 className="section-heading mt-2">
              How It <span className="accent-text">Works</span>
            </h2>
          </div>
          <Row className="g-4 justify-content-center">
            {processSteps.map((step, i) => (
              <Col lg={3} md={6} key={i}>
                <motion.div
                  className="process-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="process-number">{step.step}</div>
                  {i < processSteps.length - 1 && <div className="process-connector" />}
                  <h5 className="process-title">{step.title}</h5>
                  <p className="process-desc">{step.desc}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ─── GALLERY STRIP ─── */}
      <section className="gallery-section">
        <div className="text-center mb-4 pt-5" data-aos="fade-up">
          <span className="section-tag">Visual Journey</span>
          <h2 className="section-heading mt-2">
            Inside <span className="accent-text">Kovais</span>
          </h2>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedImage(item)}
              style={{ cursor: 'pointer' }}
            >
              <img src={item.image} alt={item.caption} loading="lazy" decoding="async" />
              <div className="gallery-caption">{item.caption}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── AWARDS ─── */}
      <section className="awards-section py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-tag">Recognition</span>
            <h2 className="section-heading mt-2">
              Awards & <span className="accent-text">Accolades</span>
            </h2>
          </div>
          <Row className="g-4 justify-content-center">
            {awards.map((award, i) => (
              <Col lg={4} md={6} key={i}>
                <motion.div
                  className="award-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div className="award-icon">{award.icon}</div>
                  <h5 className="award-title">{award.title}</h5>
                  <span className="award-year">{award.year}</span>
                  <p className="award-org">{award.org}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials-section py-5">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <span className="section-tag">Guest Voices</span>
            <h2 className="section-heading mt-2">
              What Our <span className="accent-text">Guests</span> Say
            </h2>
          </div>
          <Row className="g-4">
            {testimonials.map((t, i) => (
              <Col md={4} key={t.id}>
                <motion.div
                  className="testimonial-card-new"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                >
                  <div className="testimonial-quote-mark">"</div>
                  <p className="testimonial-text">{t.comment}</p>
                  <div className="testimonial-stars mb-3">
                    {[...Array(5)].map((_, j) => (
                      <FaStar key={j} className={j < t.rating ? "star-filled" : "star-empty"} />
                    ))}
                  </div>
                  <div className="testimonial-author">
                    <img src={t.image} alt={t.name} className="testimonial-avatar" loading="lazy" />
                    <div>
                      <strong className="author-name">{t.name}</strong>
                      <span className="author-role">{t.role}</span>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="cta-section">
        <div className="cta-inner">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="cta-eyebrow">Your Journey Starts Here</span>
            <h2 className="cta-title">
              Ready to Experience <br />True <em>Kovais</em> Luxury?
            </h2>
            <p className="cta-sub">
              Join thousands of guests who trust Kovais for their wellness and hospitality needs.
            </p>
            <div className="cta-buttons">
              <button className="cta-btn-primary" onClick={scrollToOffer}>
                Book a Service
              </button>
              <button className="cta-btn-secondary" onClick={() => handleNavigation('/contact')}>
                Get in Touch
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer-new">
        <Container>
          <Row className="g-5 pt-5 pb-4">

            {/* Brand */}
            <Col lg={4} md={12}>
              <div className="footer-brand-block">
                <h4 className="footer-logo">Kovais</h4>
                <p className="footer-tagline">
                  Coimbatore's premier destination for luxury hospitality, holistic wellness, and expert grooming. Where every visit becomes a memory.
                </p>
                <div className="footer-socials">
                  {[
                    { icon: <FaFacebook />, href: "https://facebook.com", label: "Facebook" },
                    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
                    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
                    { icon: <FaWhatsapp />, href: "https://wa.me/919876543210", label: "WhatsApp" },
                  ].map((s, i) => (
                    <motion.a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-btn"
                      title={s.label}
                      whileHover={{ y: -4, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </Col>

            {/* Services */}
            <Col lg={2} md={4} sm={6}>
              <h6 className="footer-col-title">Services</h6>
              <ul className="footer-nav-list">
                {[["Hotel", "/search-results"], ["Spa", "/spa"], ["Gym", "/gym"], ["Barber", "/barber"], ["Funeral", "/funeral"], ["Function", "/function"]].map(([label, path], i) => (
                  <li key={i}>
                    <button className="footer-nav-link" onClick={() => handleNavigation(path)}>
                      <FaChevronRight size={10} /> {label}
                    </button>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={4} sm={6}>
              <h6 className="footer-col-title">Company</h6>
              <ul className="footer-nav-list">
                {[["About Us", "/about"], ["Gallery", "/gallery"], ["Contact", "/contact"], ["Blog", "/blog"], ["Careers", "/careers"]].map(([label, path], i) => (
                  <li key={i}>
                    <button className="footer-nav-link" onClick={() => handleNavigation(path)}>
                      <FaChevronRight size={10} /> {label}
                    </button>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Contact */}
            <Col lg={4} md={4}>
              <h6 className="footer-col-title">Contact Us</h6>
              <div className="footer-contact-list">
                <a href="tel:+919234567891" className="footer-contact-item" style={{ textDecoration: 'none' }}>
                  <FaPhoneAlt className="footer-contact-icon" />
                  <div>
                    <span className="footer-contact-label">Phone</span>
                    <span className="footer-contact-value">+91 92345 67891</span>
                  </div>
                </a>
                <a href="https://wa.me/919234567891" target="_blank" rel="noopener noreferrer" className="footer-contact-item" style={{ textDecoration: 'none' }}>
                  <FaWhatsapp className="footer-contact-icon" />
                  <div>
                    <span className="footer-contact-label">WhatsApp</span>
                    <span className="footer-contact-value">+91 92345 67891</span>
                  </div>
                </a>
                <a href="mailto:info@kovaisbeauty.com" className="footer-contact-item" style={{ textDecoration: 'none' }}>
                  <FaEnvelope className="footer-contact-icon" />
                  <div>
                    <span className="footer-contact-label">Email</span>
                    <span className="footer-contact-value">info@kovaisbeauty.com</span>
                  </div>
                </a>
                <a href="https://maps.google.com/?q=Coimbatore,Tamil+Nadu" target="_blank" rel="noopener noreferrer" className="footer-contact-item" style={{ textDecoration: 'none' }}>
                  <FaMapMarkerAlt className="footer-contact-icon" />
                  <div>
                    <span className="footer-contact-label">Location</span>
                    <span className="footer-contact-value">Coimbatore, Tamil Nadu</span>
                  </div>
                </a>
              </div>
            </Col>
          </Row>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} <span className="footer-brand-name">Kovais</span>. All rights reserved. Crafted with care in Coimbatore.</p>
            <div className="footer-bottom-links">
              <button className="footer-bottom-link" onClick={() => handleNavigation('/privacy')}>Privacy Policy</button>
              <button className="footer-bottom-link" onClick={() => handleNavigation('/terms')}>Terms of Service</button>
            </div>
          </div>
        </Container>
      </footer>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <motion.div
          className="gallery-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="lightbox-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage.image} alt={selectedImage.caption} />
            <div className="lightbox-caption">{selectedImage.caption}</div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default Home;