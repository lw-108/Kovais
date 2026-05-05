import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AOS from "aos";
import "aos/dist/aos.css";

import spa from "./spa.jpg";
import gym from "./gym.jpg";
import hotel from "./hotel.jpg";
import barber from "./barber.jpg";
import "./About.css";

import {
  FaBolt, FaShieldAlt, FaGem, FaHeadset, FaRocket,
  FaCheck, FaStar, FaSearch, FaCalendarAlt, FaSmile,
  FaUsers, FaBuilding, FaClock,
} from "react-icons/fa";

// Counter Hook for animated stats
function useCounter(target, isFloat = false, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView && !started) {
      setStarted(true);
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, started, target, duration]);

  return { count, ref };
}

function StatItem({ value, suffix, label, icon, isFloat = false }) {
  const { count, ref } = useCounter(value, isFloat, 2000);
  const displayValue = isFloat ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return (
    <div ref={ref} className="stats-card h-100">
      <div className="stats-icon">{icon}</div>
      <div className="stats-number">
        {displayValue}{suffix}
      </div>
      <div className="stats-label">{label}</div>
    </div>
  );
}

function About() {
  const services = [
    { img: spa, title: "Luxury AC Room", description: "Experience world-class hospitality with premium AC rooms, offering unmatched comfort, elegant interiors, and a tranquil ambiance for your perfect stay.", number: "01" },
    { img: spa, title: "Relaxing Spa", description: "Rejuvenate your body and mind with our expert spa treatments, crafted to deliver deep relaxation and holistic wellness.", number: "02" },
    { img: gym, title: "Modern Gym", description: "Train with state-of-the-art equipment in our fully-equipped modern gym, designed to help you achieve your fitness goals.", number: "03" },
    { img: barber, title: "Premium Salon", description: "Get styled by expert professionals in our premium salon, offering trending haircuts, grooming, and beauty services.", number: "04" },
  ];

  const features = [
    { icon: <FaBolt />, title: "Instant Booking", description: "Reserve your favourite services in seconds with our lightning-fast booking system — no waiting, no hassle." },
    { icon: <FaGem />, title: "Exclusive Perks", description: "Unlock special discounts, loyalty rewards, and members-only promotions designed for regulars." },
    { icon: <FaShieldAlt />, title: "Secure & Trusted", description: "Bank-grade security for every transaction. Your data and payments are always fully protected." },
    { icon: <FaHeadset />, title: "24/7 Support", description: "Our dedicated support team is always available to assist you — any hour, any day of the week." },
    { icon: <FaRocket />, title: "Smart Recommendations", description: "AI-powered suggestions tailored to your preferences and booking history for a personalised touch." },
  ];

  const processSteps = [
    { number: "01", icon: <FaSearch />, title: "Browse & Discover", description: "Explore our curated selection of premium services — hotels, spas, gyms, and salons — all in one place." },
    { number: "02", icon: <FaCalendarAlt />, title: "Pick a Slot", description: "View real-time availability and choose a date and time that perfectly fits your schedule." },
    { number: "03", icon: <FaShieldAlt />, title: "Secure Booking", description: "Confirm your reservation with our encrypted, hassle-free payment system in seconds." },
    { number: "04", icon: <FaSmile />, title: "Enjoy the Experience", description: "Arrive and be welcomed. Your pre-booked premium experience awaits — stress-free and seamless." },
  ];

  const testimonials = [
    { text: "Kovais completely transformed how I book my spa days. The interface is elegant, fast, and I always get exactly what I need. Truly a luxury experience from start to finish.", author: "Priya Ramesh", role: "Lifestyle Blogger", initials: "PR", stars: 5 },
    { text: "I travel frequently for work and Kovais has become my go-to for hotel pre-bookings. Instant confirmation, great pricing, and zero surprises at check-in. Highly recommend.", author: "Arjun Nair", role: "Senior Consultant", initials: "AN", stars: 5 },
    { text: "The gym booking feature is brilliant. I can plan my workout slots a week in advance, and the reminders are spot-on. Kovais feels like a personal concierge.", author: "Meena Sundaram", role: "Fitness Enthusiast", initials: "MS", stars: 5 },
  ];

  const marqueeItems = ["Luxury Hotels", "Rejuvenating Spas", "Modern Gyms", "Premium Salons", "Instant Booking", "Trusted by 10,000+", "24 / 7 Support", "Verified Partners"];

  useEffect(() => { AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" }); }, []);

  return (
    <>
      {/* 1. HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <motion.div 
            className="about-badge mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-dot" />
            Premium Services Platform
          </motion.div>
          <motion.h1 
            className="about-hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Elevate Your Lifestyle<br />with <span className="text-gradient">Kovais</span>
          </motion.h1>
          <motion.p 
            className="about-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your all-in-one destination for seamless pre-booking of premium services — from luxury hotels and rejuvenating spas to modern gyms and expert salons.
          </motion.p>
        </div>
        <div className="hero-scroll-indicator"><div className="scroll-dot" /></div>
      </section>

      {/* 2. MARQUEE */}
      <div className="about-marquee">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span className="marquee-item" key={i}><span className="marquee-dot">◆</span>{item}</span>
          ))}
        </div>
      </div>

      {/* 3. FEATURES */}
      <section className="about-features py-5">
        <Container>
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-heading mt-2">Built for <span className="text-gradient">Excellence</span></h2>
            <p className="section-desc mt-3">Every detail is crafted to deliver a premium, hassle-free experience from start to finish.</p>
          </div>
          <Row className="g-4 justify-content-center">
            {features.map((f, i) => (
              <Col lg={4} md={6} key={i}>
                <motion.div 
                  className="feature-card h-100"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div className="feature-icon-wrap">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.description}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 4. SERVICES */}
      <section className="about-services py-5">
        <Container fluid="xl">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Our Services</span>
            <h2 className="section-heading mt-2">Curated <span className="text-gradient">Experiences</span></h2>
            <p className="section-desc mt-3">Discover our handpicked range of premium services, each designed to exceed your expectations.</p>
          </div>
          <Row className="g-4 justify-content-center">
            {services.map((s, i) => (
              <Col xl={3} lg={4} md={6} key={i}>
                <motion.div 
                  className="service-card h-100"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <img src={s.img} alt={s.title} className="service-card-img" loading="lazy" />
                  <div className="service-card-overlay">
                    <span className="service-card-number">{s.number}</span>
                    <h3 className="service-card-title">{s.title}</h3>
                    <p className="service-card-text">{s.description}</p>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 5. PROCESS */}
      <section className="about-process py-5">
        <Container>
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag" style={{ color: 'var(--gold-light)' }}>How It Works</span>
            <h2 className="section-heading-white mt-2">Simple. Seamless. <span className="text-gradient">Premium.</span></h2>
            <p className="section-desc-white mt-3">From discovery to confirmation — four effortless steps to your perfect experience.</p>
          </div>
          <Row className="g-4 justify-content-center">
            {processSteps.map((step, i) => (
              <Col lg={3} md={6} key={i}>
                <motion.div 
                  className="process-card h-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <div className="process-number">{step.number}</div>
                  <div className="process-icon">{step.icon}</div>
                  <h4 className="process-title">{step.title}</h4>
                  <p className="process-desc">{step.description}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 6. MISSION */}
      <section className="about-mission py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <motion.div 
                className="mission-left"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="mission-image-grid">
                  <div className="mission-img-wrap"><img src={hotel} alt="Luxury Hotel" /></div>
                  <div className="mission-img-wrap"><img src={spa} alt="Spa Experience" /></div>
                  <div className="mission-img-wrap"><img src={gym} alt="Modern Gym" /></div>
                </div>
                <div className="mission-floating-card">
                  <div className="floating-card-icon"><FaStar /></div>
                  <div className="floating-card-text">
                    <strong>4.9 / 5</strong>
                    <span>Customer Rating</span>
                  </div>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="offset-lg-1">
              <motion.div 
                className="mission-right"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-start">
                  <span className="section-tag">Our Mission</span>
                  <h2 className="section-heading mt-2">Redefining How You Book <span className="text-gradient">Premium Services</span></h2>
                </div>
                <p className="mission-text mt-4">At Kovais, we believe in making luxury accessible. Our platform bridges the gap between you and the finest services, ensuring a seamless, delightful booking experience every time.</p>
                <ul className="mission-points mt-4">
                  <li><span className="point-icon"><FaCheck /></span>Curated selection of verified premium service providers</li>
                  <li><span className="point-icon"><FaCheck /></span>Real-time availability with instant confirmation</li>
                  <li><span className="point-icon"><FaCheck /></span>Personalised recommendations powered by smart algorithms</li>
                  <li><span className="point-icon"><FaCheck /></span>Transparent pricing with no hidden charges</li>
                </ul>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 7. STATS */}
      <section className="about-stats py-5">
        <Container>
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Our Numbers</span>
            <h2 className="section-heading mt-2">Trusted at <span className="text-gradient">Scale</span></h2>
            <p className="section-desc mt-3">Milestones that reflect our commitment to delivering a world-class booking experience.</p>
          </div>
          <Row className="g-4 justify-content-center">
            <Col lg={3} md={6}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }} className="h-100">
                <StatItem value={10000} suffix="+" label="Happy Clients" icon={<FaUsers />} />
              </motion.div>
            </Col>
            <Col lg={3} md={6}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }} className="h-100">
                <StatItem value={500} suffix="+" label="Partner Venues" icon={<FaBuilding />} />
              </motion.div>
            </Col>
            <Col lg={3} md={6}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} className="h-100">
                <StatItem value={4.9} isFloat={true} suffix=" / 5" label="Average Rating" icon={<FaStar />} />
              </motion.div>
            </Col>
            <Col lg={3} md={6}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }} className="h-100">
                <StatItem value={3} suffix=" Min" label="Avg. Booking Time" icon={<FaClock />} />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="about-testimonials py-5">
        <Container>
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag" style={{ color: 'var(--gold-light)' }}>Testimonials</span>
            <h2 className="section-heading-white mt-2">What Our <span className="text-gradient">Clients</span> Say</h2>
            <p className="section-desc-white mt-3">Real stories from people who've experienced the Kovais difference.</p>
          </div>
          <Row className="g-4 justify-content-center">
            {testimonials.map((t, i) => (
              <Col lg={4} md={6} key={i}>
                <motion.div 
                  className="testimonial-card h-100"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <span className="testimonial-quote">"</span>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, si) => (
                      <span key={si} className={si < t.stars ? "star-filled" : "star-empty"}>★</span>
                    ))}
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">{t.initials}</div>
                    <div className="author-info">
                      <span className="author-name">{t.author}</span>
                      <span className="author-role">{t.role}</span>
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 9. CTA */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="cta-eyebrow">Get Started Today</span>
            <h2 className="cta-title">Ready to Experience <br /><em>Luxury</em> on Your Terms?</h2>
            <p className="cta-sub">Join over 10,000 clients who pre-book with confidence. Your next premium experience is just a tap away.</p>
            <div className="cta-buttons">
              <button className="cta-btn-primary">Book Now</button>
              <button className="cta-btn-secondary">Explore Services</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="about-footer">
        <Container>
          <p className="mb-0">
            &copy; {new Date().getFullYear()} KOVAIS. All Rights Reserved. &nbsp;|&nbsp; Contact: <a href="tel:9234567891">+91 92345 67891</a> &nbsp;|&nbsp; Email: <a href="mailto:info@kovaisbeauty.com">info@kovaisbeauty.com</a>
          </p>
        </Container>
      </footer>
    </>
  );
}

export default About;