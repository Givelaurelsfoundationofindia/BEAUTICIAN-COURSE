


import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Register from "./pages/Registration.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import "./App.css";
const highlights = [
  { icon: "", title: "Course Duration", value: "1 Month" },
  { icon: "", title: "Course is", value: "FREE" },
  { icon: "", title: "Only", value: "25 Seats" },
  { icon: "", title: "Age", value: "18 – 28 Years" },
  { icon: "", title: "Qualification", value: "10th and Above Eligible" },
];
function HomePage() {
  return (
    <div className="website">

      {/* NAVIGATION */}
      <header className="navbar">
        <div className="brand">
          <img
            src="/give-laurels-logo.jpeg"
            alt="Give Laurels Foundation of India"
          />
        </div>

        <nav className="nav-links">
          <a href="#home" className="active">Home</a>
          <a href="#about">About Us</a>
          <a href="#course">Course Details</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <Link to="/register" className="nav-button">
          Register Now
        </Link>
      </header>

      <main id="home">

        {/* HOME HERO SECTION */}
        <section className="hero">

          <div className="hero-left">

            <h1>
              <span className="free-text">FREE</span>
              <span className="beautician-text">BEAUTICIAN</span>
              <span className="course-title">Training Course</span>
            </h1>

            <p className="hero-description">
              Learn Basic Beauty Skills &amp; Build
              <br />
              Your Future
            </p>

            <div className="pink-line"></div>

            {/* HIGHLIGHTS */}
            <div className="highlights">
              {highlights.map((item, index) => (
                <div className="highlight-card" key={index}>
                  <div className="highlight-icon">
                    {item.icon}
                  </div>

                  <p>{item.title}</p>
                  <h3>{item.value}</h3>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-right">
            <div className="image-background"></div>

            <img
              className="beauty-image"
              src="/beautician-hero.png"
              alt="Beautician applying makeup to a bride"
            />

          </div>

        </section>

      </main>

      {/* ABOUT US SECTION */}
      <section className="about-section" id="about">

        <div className="about-content">

          <h2>About Us</h2>

          <div className="about-underline"></div>

          <h3>Give Laurels Foundation of India</h3>

          <p>
            Give Laurels Foundation of India is a section 8 company
            committed to empowering individuals through education,
            skill development and meaningful opportunities.
          </p>

          <p>
            We are providing a
            <strong> Free Basic Beautician Training Course </strong>
            to help young women learn essential beauty care
            skills, gain practical knowledge and build employment
            and self-employment opportunities.
          </p>

          <p>
            This programme is designed for beginners and focuses
            on basic beautician skills. Our aim is to create
            opportunities, build confidence and support
            financial independence.
          </p>

          <div className="about-cards">

            <div className="about-card">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <rect x="5" y="36" width="12" height="23" rx="3"/>
                <rect x="25" y="22" width="12" height="37" rx="3"/>
                <rect x="45" y="5" width="12" height="54" rx="3"/>
              </svg>
              <h4>Skill Development</h4>
            </div>

            <div className="about-card">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="17" r="11"/>
                <circle cx="12" cy="25" r="8"/>
                <circle cx="52" cy="25" r="8"/>
                <path d="M10 56V48C10 38 19 31 32 31S54 38 54 48V56Z"/>
                <path d="M1 51V44C1 38 5 34 12 33M63 51V44C63 38 59 34 52 33"/>
              </svg>
              <h4>Empowerment</h4>
            </div>

            <div className="about-card">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <rect x="5" y="18" width="54" height="39" rx="5"/>
                <path d="M23 18V11C23 8 25 6 28 6H36C39 6 41 8 41 11V18"/>
                <path d="M5 33H59M27 30V36H37V30"/>
              </svg>
              <h4>Job Opportunities</h4>
            </div>

            <div className="about-card">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <path
                  d="M32 55L9 33C-5 17 15 1 32 17C49 1 69 17 55 33Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
              </svg>
              <h4>Community Support</h4>
            </div>

          </div>
        </div>
      </section>

      {/* COURSE DETAILS SECTION */}
      
{/* COURSE DETAILS SECTION */}
<section className="course-section" id="course">
  <div className="course-container">

    <span className="course-label">
      OUR TRAINING PROGRAMME
    </span>

    <h2>Basic Beautician Course Details</h2>

    <div className="course-underline"></div>

    <p className="course-intro">
      Learn essential beauty skills through beginner-friendly
      training in hair care and styling, skin care, and basic facials.
    </p>

    <div className="course-grid">

      {/* 1. HAIR CARE */}
      <div className="course-card">
        <div className="course-visual hair-visual">
          <span>💇‍♀️</span>
        </div>

        <div className="course-card-content">
          <h3>1. Basic Hair Care & Styling</h3>
          <ul>
            <li>Understanding different hair types</li>
            <li>Basic hair washing techniques</li>
            <li>Hair conditioning and care</li>
            <li>Simple everyday hairstyles</li>
            <li>Basic hair styling techniques</li>
          </ul>
        </div>
      </div>

      {/* 2. SKIN CARE */}
      <div className="course-card">
        <div className="course-visual skin-visual">
          <span>🧖‍♀️</span>
        </div>

        <div className="course-card-content">
          <h3>2. Basic Skin Care</h3>
          <ul>
            <li>Understanding different skin types</li>
            <li>Basic skin cleansing techniques</li>
            <li>Daily skin care routine</li>
            <li>Basic skin care products</li>
            <li>Skin care practices</li>
          </ul>
        </div>
      </div>

      {/* 3. BASIC FACIALS */}
      <div className="course-card">
        <div className="course-visual facial-visual">
          <span>✨</span>
        </div>

        <div className="course-card-content">
          <h3>3. Basic Facials</h3>
          <ul>
            <li>Introduction to basic facials</li>
            <li>Facial preparation and cleansing</li>
            <li>Basic facial steps</li>
            <li>Facial massage techniques</li>
            <li>Post-facial skin care</li>
          </ul>
        </div>
      </div>

    </div>

    {/* REGISTER BUTTON */}
    <div className="course-register-wrapper">
      <a href="/register" className="course-register-btn">
        Register for Free Training →
      </a>
    </div>

    {/* IMPORTANT EQUIPMENT NOTICE - AT THE BOTTOM */}
    <div className="equipment-notice">

      <div className="equipment-notice-heading">
        <span className="equipment-warning-icon"></span>
        <h3>IMPORTANT NOTICE – PLEASE READ</h3>
      </div>

      <h2>BRING YOUR OWN EQUIPMENT</h2>

      <p>
        All Users must bring their own basic beautician tools
        and personal practice materials for the training sessions.
      </p>

      <strong>
        Equipment will NOT be provided
      </strong>

    </div>

  </div>
</section>
{/* FAQ SECTION */}
<section className="faq-section" id="faq">
  <div className="faq-container">
   
    <h2>Frequently Asked <span>Questions</span></h2>
    
    <div className="faq-list">

      <details className="faq-item">
        <summary>Is this beautician training course completely free?</summary>
        <p>Yes! The basic beautician training course offered by Give Laurels Foundation of India is free.</p>
      </details>

      <details className="faq-item">
        <summary>Who is eligible to apply?</summary>
        <p>Applicants must be between 18 and 28 years of age and should have completed at least 10th standard.</p>
      </details>

      <details className="faq-item">
        <summary>What is the duration of the course?</summary>
        <p>The basic beautician training course duration is one month.</p>
      </details>

      <details className="faq-item">
        <summary>What topics will be covered in the training?</summary>
        <p>The course covers Basic Hair Care & Styling, Basic Skin Care and Basic Facials.</p>
      </details>

      <details className="faq-item">
        <summary>How many seats are available?</summary>
        <p>Only 25 seats are available for this training programme.</p>
      </details>

      <details className="faq-item">
        <summary>Will the foundation provide beautician equipment?</summary>
        <p>No. Students must bring their own basic beautician tools and personal practice materials. Equipment will not be provided by Give Laurels Foundation of India.</p>
      </details>

      <details className="faq-item">
        <summary>How can I register for the course?</summary>
        <p>You can register through our online registration form by clicking the Register Now button on this website.</p>
      </details>

      <details className="faq-item">
        <summary>Can I contact the foundation for more information?</summary>
        <p>Yes. Please use the Contact Us section of our website to reach Give Laurels Foundation of India.</p>
      </details>

    </div>
  </div>
</section>
      {/* CONTACT US SECTION */}
      <section className="contact-section" id="contact">

        <div className="contact-container">

          <span className="contact-label">GET IN TOUCH</span>

          <h2 className="contact-title">
            Contact <span>Us </span>
          </h2>

          <div className="contact-title-line"></div>

          <h3 className="contact-subtitle">
            We'd Love to Hear from You
          </h3>

          <p className="contact-intro">
            Have a question, need more information, or want to know
            <br />
            about our training programme? Reach out to us — we're here to help!
          </p>

          <div className="contact-layout">

            {/* OFFICE CARD */}
            <div className="contact-info-card office-card">

              <div className="contact-wave"></div>

              <div className="contact-icon office-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-7.2 8-13a8 8 0 1 0-16 0c0 5.8 8 13 8 13Z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>

              <h3>Our Office</h3>

              <p>
                #96, 2nd FLOOR SPACE TREE,<br />
                UNITY MALL, RUDRA TECHNO ENCLAVE,<br />
                BESIDE RAILINGS METRO STATION,<br />
                HITEC CITY, Madhapur,<br />
                Hyderabad, Telangana 500081.
              </p>

              <a
                className="location-button"
                href="https://www.google.com/maps/search/?api=1&query=UNITY+MALL+RUDRA+TECHNO+ENCLAVE+HITEC+CITY+Madhapur+Hyderabad+500081"
                target="_blank"
                rel="noreferrer"
              >
                <span>⌖</span> View Location <span>→</span>
              </a>

            </div>

            {/* PHONE CARD */}
            <div className="contact-info-card phone-card">

              <div className="contact-wave"></div>

              <div className="contact-icon phone-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/>
                </svg>
              </div>

              <h3>Call Us</h3>

              <div className="phone-numbers">
                <a href="tel:+919347823942">+91 9347823942</a>
                <a href="tel:+919347823943">+91 9347823943</a>
                <a href="tel:+919347839434">+91 9347813943</a>
              </div>

              <div className="timing-divider"></div>

              <div className="office-timing">
                <span>◷</span>
                <p>
                  Monday – Saturday<br />
                  10:00 AM – 7:00 PM
                </p>
              </div>

            </div>

            {/* EMAIL CARD */}
            <div className="contact-info-card email-card">

              <div className="contact-wave"></div>

              <div className="contact-icon email-icon">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m3 6 9 7 9-7"/>
                </svg>
              </div>

              <h3>Email Us</h3>

              <div className="email-addresses">
                <a href="mailto:info@givelaurelsfoundation.com">
                  info@givelaurelsfoundation.com
                </a>

                <a href="mailto:support@givelaurelsfoundation.org">
                  support@givelaurelsfoundation.org
                </a>
              </div>

              <div className="email-divider"></div>

              <div className="email-message">

              </div>

            </div>

          </div>

          {/* SOCIAL MEDIA SECTION */}
          <div className="contact-social">

            <h2>
              Connect <span>With Us</span>
            </h2>

            <div className="social-title-line"></div>

            <p>
              Follow Give Laurels Foundation of India on social media.
            </p>

            <div className="social-icons">

              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/givelaurelsfoundationofindia/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="social-icon instagram"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="18" cy="6" r="1"/>
                </svg>
              </a>

              {/* YOUTUBE */}
              <a
                href="https://www.youtube.com/channel/UCpE9niJWvxJVFe-LiNH9x4g"
                target="_blank"
                rel="noreferrer"
                className="social-icon youtube"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M23 7a3 3 0 0 0-2-2C19 4.5 12 4.5 12 4.5s-7 0-9 .5a3 3 0 0 0-2 2A31 31 0 0 0 .5 12a31 31 0 0 0 .5 5 3 3 0 0 0 2 2c2 .5 9 .5 9 .5s7 0 9-.5a3 3 0 0 0 2-2 31 31 0 0 0 .5-5 31 31 0 0 0-.5-5Z"/>
                  <path d="m10 8 6 4-6 4Z" className="youtube-play"/>
                </svg>
              </a>

              {/* LINKEDIN */}
              <a
                href="https://www.linkedin.com/in/givelaurelsfoundation-of-india-19185a409/"
                target="_blank"
                rel="noreferrer"
                className="social-icon linkedin"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M5 8H2v14h3ZM3.5 2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM22 13.5c0-4-2.1-5.9-5-5.9a4.4 4.4 0 0 0-4 2.2V8H10v14h3v-7.5c0-2 1-3.2 2.7-3.2s2.3 1.2 2.3 3.2V22h3Z"/>
                </svg>
              </a>

              {/* FACEBOOK */}
              <a
                href="https://www.facebook.com/profile.php?id=61591867197927"
                target="_blank"
                rel="noreferrer"
                className="social-icon facebook"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.3c0-1 .3-1.8 1.8-1.8H17V2.4c-.8-.1-1.8-.2-2.8-.2-3 0-5 1.8-5 5.1v2.2H6V13h3.2v9Z"/>
                </svg>
              </a>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

/* =====================================================
   MAIN APP ROUTING
===================================================== */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN WEBSITE */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* REGISTRATION PAGE */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* ADMIN LOGIN PAGE */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
