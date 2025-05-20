'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../../components/footer';
import ProfileDropdown from '../../components/ProfileDropdown';

export default function RegulationPage() {
  const [name, setName] = useState('User');
  const [profilePic] = useState('/images/default-avatar.png');
  const [calories] = useState('');
  const role = 'member'; // Simulate role, replace with real logic
  const [openSection, setOpenSection] = useState('general');
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    const storedName = localStorage.getItem('userName');
    if (storedName) setName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Custom Accordion Data
  const accordionData = [
    {
      key: 'general',
      title: 'General Conduct',
      content: (
        <ul style={{marginBottom: 0}}>
          <li>Be respectful and courteous to all gym users, regardless of their fitness level.</li>
          <li>Use appropriate language and tone. Avoid yelling, teasing, or offensive gestures.</li>
          <li>Personal phone conversations should be taken outside the workout zones.</li>
          <li>Report any suspicious behavior or incidents immediately to the gym staff.</li>
          <li>Follow instructions given by the gym trainers or management.</li>
        </ul>
      )
    },
    {
      key: 'equipment',
      title: 'Equipment Usage',
      content: (
        <ul style={{marginBottom: 0}}>
          <li>Always return dumbbells, barbells, and other movable equipment to their original racks after use.</li>
          <li>Allow others to "work in" during sets when the gym is crowded.</li>
          <li>Avoid slamming or dropping weights unnecessarily as it damages equipment and causes noise pollution.</li>
          <li>If a machine is out of order, report it immediately and refrain from using it.</li>
          <li>Do not bring unauthorized equipment into the gym area unless approved by staff.</li>
        </ul>
      )
    },
    {
      key: 'hygiene',
      title: 'Hygiene',
      content: (
        <ul style={{marginBottom: 0}}>
          <li>Always bring a clean towel and place it on benches or mats before use.</li>
          <li>Wipe down machines and mats with disinfectant sprays after use.</li>
          <li>Ensure gym attire is clean and appropriate; avoid strong perfumes or colognes.</li>
          <li>Wear indoor sports shoes or non-marking soles only; outdoor footwear is prohibited inside workout zones.</li>
          <li>Use deodorant or antiperspirant to maintain a pleasant atmosphere.</li>
        </ul>
      )
    }
  ];

  return (
    <div className="regulation-page">
      {/* Custom Navbar */}
      <nav className="custom-navbar">
        <ProfileDropdown calories={calories} onLogout={handleLogout} />
        <div className="navbar-left">
          <Image src="/images/cstlogo.png" alt="CST Gym Logo" width={56} height={56} style={{ borderRadius: '50%', marginRight: '1rem' }} />
          <span className="navbar-title">CST Gym</span>
        </div>
        <div className="navbar-links">
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/gallery">Gallery</a>
          <a href="/regulation">Regulation</a>
          <a href="/equipment">Equipments</a>
        </div>
      </nav>
      <div style={{ height: '90px' }} />

      {/* Hero Section */}
      <section className="text-center regulation-hero d-flex align-items-center justify-content-center position-relative">
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="hero-content w-100" style={{ zIndex: 2 }} data-aos="fade-up">
          <h1 className="mb-3 display-3 fw-bold">CST GYM REGULATIONS</h1>
          <p className="lead">Explore Our Guidelines for a Better Gym Experience</p>
        </div>
      </section>

      {/* Gym Guidelines Table */}
      <section className="container my-5 gym-guidelines" data-aos="fade-up">
        <h2 className="mb-4 text-center">GYM GUIDELINES</h2>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Category</th>
                <th>Allowed</th>
                <th>Not Allowed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>General Conduct</td>
                <td>Respect all members</td>
                <td>Disruptive behavior</td>
              </tr>
              <tr>
                <td>Equipment Usage</td>
                <td>Return weights after use</td>
                <td>Dropping weights loudly</td>
              </tr>
              <tr>
                <td>Hygiene</td>
                <td>Wipe equipment after use</td>
                <td>Using gym without a towel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Rules Accordion */}
      <section className="container my-5 detailed-rules" data-aos="fade-up">
        <h3 className="mb-4 text-center">DETAILED RULES</h3>
        <div className="custom-accordion">
          {accordionData.map(section => (
            <div className="custom-accordion-item" key={section.key}>
              <button
                className={`custom-accordion-header${openSection === section.key ? ' open' : ''}`}
                onClick={() => setOpenSection(openSection === section.key ? '' : section.key)}
                aria-expanded={openSection === section.key}
                aria-controls={`custom-accordion-body-${section.key}`}
                style={{width: '100%', textAlign: 'left', padding: '1rem', fontSize: '1.2rem', fontWeight: 600, border: 'none', background: openSection === section.key ? '#e3f0ff' : '#fff', borderBottom: '1px solid #eee', cursor: 'pointer', outline: 'none'}}
              >
                {section.title}
                <span style={{float: 'right', fontSize: '1.3rem'}}>{openSection === section.key ? '\u25B2' : '\u25BC'}</span>
              </button>
              <div
                id={`custom-accordion-body-${section.key}`}
                className="custom-accordion-body"
                style={{
                  display: openSection === section.key ? 'block' : 'none',
                  background: '#fff',
                  color: '#222',
                  fontSize: '1rem',
                  padding: openSection === section.key ? '1rem' : '0',
                  borderBottom: '1px solid #eee',
                  transition: 'all 0.3s',
                }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .regulation-page {
          min-height: 100vh;
        }
        .regulation-hero {
          min-height: 100vh;
          background-image: url('/images/rule.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .hero-overlay {
          background: rgba(0, 0, 0, 0.5);
        }
        .hero-content {
          color: white;
          padding: 2rem;
        }
        .custom-navbar {
          width: 100%;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          display: flex;
          align-items: center;
          padding: 0.5rem 2rem;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          height: 90px;
          flex-wrap: wrap;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .navbar-title {
          font-weight: 700;
          font-size: 2rem;
          letter-spacing: 0.02em;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          flex: 2;
          justify-content: space-evenly;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .navbar-links a {
          color: #222;
          text-decoration: none;
          font-size: 1.2rem;
          padding: 0.2rem 0.7rem;
        }
        .profile-dropdown {
          position: relative;
          margin-right: 1.5rem;
          margin-left: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          background: #f3f3f3;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          padding: 0.7rem 1rem;
          width: 240px;
          border: 1.5px solid #222;
        }
        .profile-avatar-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .profile-avatar {
          border-radius: 50%;
          border: 2px solid #eee;
        }
        .profile-name-navbar {
          font-weight: 600;
          font-size: 1.1rem;
          margin-left: 0.3rem;
        }
        .profile-caret {
          font-size: 0.8rem;
          margin-left: 0.3rem;
        }
        .profile-menu {
          position: absolute;
          left: 0;
          top: 110%;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border-radius: 1rem;
          width: 240px;
          padding: 0.5rem 0;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          border: 1.5px solid #222;
        }
        .profile-menu-item {
          padding: 0.7rem 1.2rem;
          font-size: 1rem;
          color: #222;
          cursor: pointer;
          transition: background 0.2s;
        }
        .profile-menu-item:hover {
          background: #f3f3f3;
        }
        .profile-menu-item.logout {
          color: #d32f2f;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .navbar-title { font-size: 1.1rem; }
          .custom-navbar { padding: 0.5rem 0.5rem; }
          .regulation-hero { min-height: 60vh; }
        }
        @media (max-width: 600px) {
          .custom-navbar {
            flex-direction: column;
            height: auto;
            padding: 0.5rem 0.5rem;
            align-items: stretch;
          }
          .navbar-left {
            justify-content: center;
            margin-bottom: 0.5rem;
          }
          .navbar-title {
            font-size: 1.1rem;
          }
          .navbar-links {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
            width: 100%;
          }
          .profile-dropdown {
            margin-left: 0;
            margin-top: 0.5rem;
            align-self: flex-end;
            width: 100%;
            min-width: 0;
            max-width: 100%;
            padding: 0.7rem 0.7rem;
          }
          .profile-menu {
            width: 100%;
            min-width: 0;
            left: 0;
          }
          .regulation-hero {
            min-height: 40vh;
            padding: 2rem 0.5rem;
          }
          .hero-content {
            font-size: 1.1rem;
            padding: 1rem;
          }
          .gym-guidelines, .detailed-rules {
            padding-left: 0.2rem !important;
            padding-right: 0.2rem !important;
          }
          .table {
            font-size: 0.9rem;
          }
          .accordion-button {
            font-size: 1rem;
            padding: 0.7rem 1rem;
          }
          .accordion-body {
            font-size: 0.95rem;
            padding: 0.7rem 0.7rem;
          }
        }
        .custom-accordion {
          border-radius: 0.7rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          background: #f9f9f9;
        }
        .custom-accordion-item:last-child .custom-accordion-header,
        .custom-accordion-item:last-child .custom-accordion-body {
          border-bottom: none;
        }
        .custom-accordion-header.open {
          background: #e3f0ff;
        }
        .custom-accordion-header:focus {
          outline: 2px solid #1976d2;
        }
        .custom-accordion-body {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 