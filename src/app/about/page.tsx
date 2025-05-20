'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../../components/footer';
import ProfileDropdown from '../../components/ProfileDropdown';
import { FaDumbbell, FaUserFriends, FaChartLine } from 'react-icons/fa';

export default function AboutPage() {
  const [name, setName] = useState('User');
  const [profilePic] = useState('/images/default-avatar.png');
  const [calories] = useState('');
  const [memberCount, setMemberCount] = useState<number>(0);
  const role = 'member';

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    // Ensure user is set in localStorage for ProfileDropdown
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      localStorage.setItem('user', JSON.stringify({
        name: 'User',
        username: 'user',
        role: 'member',
      }));
    }
    const storedName = localStorage.getItem('userName');
    if (storedName) setName(storedName);
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMemberCount(data.length));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="about-page">
      {/* Consistent Navbar from Home */}
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
      <section className="text-center about-hero d-flex align-items-center justify-content-center position-relative">
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="hero-content w-100" style={{ zIndex: 2 }} data-aos="fade-up">
          <h1 className="mb-3 display-3 fw-bold">About CST Gym</h1>
          <p className="lead">Your Premier Fitness Destination</p>
        </div>
      </section>

      {/* About Content */}
      <section className="container my-5">
        <div className="row g-4">
          <div className="col-md-6" data-aos="fade-right">
            <h2 className="mb-4">Our Story</h2>
            <p className="lead">
              CST Gym was founded with a vision to create a premier fitness facility that caters to both beginners and professional athletes. Our state-of-the-art facility is designed to provide the best possible environment for achieving your fitness goals.
            </p>
            <p>
              With over 10,000 square feet of space, we offer a comprehensive range of equipment and facilities to support your fitness journey. Our expert trainers and staff are dedicated to helping you reach your full potential.
            </p>
          </div>
          <div className="col-md-6" data-aos="fade-left">
            <Image
              src="/images/gallery.png"
              alt="CST Gym Facility"
              width={600}
              height={400}
              className="rounded shadow img-fluid"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-5 row g-4">
          <div className="col-md-4" data-aos="fade-up">
            <div className="card h-100 feature-card">
              <div className="text-center card-body">
                <div className="mb-3 feature-icon">
                  <i className="fas fa-dumbbell fa-3x"></i>
                </div>
                <h3 className="card-title">Modern Equipment</h3>
                <p className="card-text">
                  Our facility is equipped with the latest fitness technology and equipment from leading manufacturers. From cardio machines to strength training equipment, we have everything you need.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
            <div className="card h-100 feature-card">
              <div className="text-center card-body">
                <div className="mb-3 feature-icon">
                  <i className="fas fa-user-friends fa-3x"></i>
                </div>
                <h3 className="card-title">Expert Trainers</h3>
                <p className="card-text">
                  Our team of certified trainers brings years of experience and expertise. They're here to guide you, motivate you, and help you achieve your fitness goals safely and effectively.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <div className="card h-100 feature-card">
              <div className="text-center card-body">
                <div className="mb-3 feature-icon">
                  <i className="fas fa-chart-line fa-3x"></i>
                </div>
                <h3 className="card-title">Comprehensive Programs</h3>
                <p className="card-text">
                  We offer a wide range of programs including personal training, group classes, and specialized fitness programs. Our calorie tracking system helps you monitor your progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section with dynamic member count */}
        <div className="py-5 mt-5 stats-section" data-aos="fade-up">
          <div className="text-center row g-4">
            <div className="col-md-4">
              <div className="stat-item">
                <h2 className="display-4 fw-bold">{memberCount}+</h2>
                <p className="lead">Active Members</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-item">
                <h2 className="display-4 fw-bold">50+</h2>
                <p className="lead">Modern Equipment</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-item">
                <h2 className="display-4 fw-bold">15+</h2>
                <p className="lead">Expert Trainers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .about-page {
          min-height: 100vh;
        }
        .about-hero {
          height: 100vh;
          background-image: url('/images/about.jpeg');
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .hero-overlay {
          background: rgba(0, 0, 0, 0.6);
        }
        .hero-content {
          color: white;
          padding: 2rem;
        }
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: none;
          border-radius: 15px;
          overflow: hidden;
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .feature-icon {
          color: #1976d2;
          margin-bottom: 1.5rem;
        }
        .stats-section {
          background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
          color: white;
          border-radius: 15px;
          margin-top: 4rem;
        }
        .stat-item {
          padding: 2rem;
        }
        .stat-item h2 {
          color: white;
          margin-bottom: 0.5rem;
        }
        .stat-item p {
          color: rgba(255,255,255,0.9);
          margin: 0;
        }
        @media (max-width: 768px) {
          .about-hero {
            height: 40vh;
          }
          .stat-item {
            padding: 1rem;
          }
        }
      `}</style>

      <style jsx global>{`
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
          gap: 0.8rem;
          width: 100%;
          justify-content: flex-start;
        }
        .profile-avatar {
          border-radius: 50%;
          border: 2px solid #ddd;
          width: 35px;
          height: 35px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        .profile-name-navbar {
          font-weight: 600;
          font-size: 1rem;
          flex-grow: 1;
        }
        .profile-caret {
          font-size: 0.8rem;
          opacity: 0.8;
          margin-left: auto;
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
          padding: 0.7rem 1rem;
          font-size: 1rem;
          color: #222;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
        }
        .profile-menu-item:hover {
          background: #f3f3f3;
        }
        .profile-menu-item.logout {
          color: #d32f2f;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .navbar-title { font-size: 1.3rem; }
          .custom-navbar { padding: 0.5rem 0.5rem; }
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
        }
      `}</style>
    </div>
  );
} 