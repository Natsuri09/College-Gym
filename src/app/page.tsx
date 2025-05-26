'use client';

import { useRouter } from 'next/navigation';
import { FaUser, FaUserTie, FaDumbbell, FaUsers, FaChartLine } from 'react-icons/fa';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="mb-4 text-white display-3 fw-bold" data-aos="fade-up">
            Welcome to CST Gym
          </h1>
          <p className="mb-5 text-white lead" data-aos="fade-up" data-aos-delay="100">
            Your journey to fitness starts here
          </p>
          <div className="hero-buttons" data-aos="fade-up" data-aos-delay="200">
            <button 
              className="btn btn-primary btn-lg me-3"
              onClick={() => router.push('/gymmember/login')}
            >
              Member Login
            </button>
            <button 
              className="btn btn-outline-light btn-lg me-3"
              onClick={() => router.push('/gymmember/register')}
            >
              Register
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => router.push('/manager/login')}
            >
              Manager Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 features-section">
        <div className="container">
          <h2 className="mb-5 text-center" data-aos="fade-up">Why Choose Us</h2>
          <div className="row g-4">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="p-4 text-center feature-card">
                <FaDumbbell className="mb-3 feature-icon" />
                <h3>Modern Equipment</h3>
                <p>State-of-the-art fitness equipment for all your workout needs</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="p-4 text-center feature-card">
                <FaUsers className="mb-3 feature-icon" />
                <h3>Expert Trainers</h3>
                <p>Professional trainers to guide you through your fitness journey</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="p-4 text-center feature-card">
                <FaChartLine className="mb-3 feature-icon" />
                <h3>Track Progress</h3>
                <p>Monitor your fitness progress with our advanced tracking system</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5 about-section bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6" data-aos="fade-right">
              <Image
                src="/images/cstgym.png"
                alt="Gym Interior"
                width={600}
                height={400}
                className="rounded img-fluid"
              />
            </div>
            <div className="col-md-6" data-aos="fade-left">
              <h2 className="mb-4">About CST Gym</h2>
              <p className="mb-4 lead">
                We are dedicated to helping you achieve your fitness goals with our comprehensive facilities and expert guidance.
              </p>
              <div className="gap-3 d-flex">
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/gymmember/register')}
                >
                  Join Now
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => router.push('/about')}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .landing-page {
          min-height: 100vh;
        }
        .hero-section {
          height: 100vh;
          background-image: url('/images/gallery.png');
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
        }
        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          padding: 2rem;
        }
        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .feature-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
        }
        .feature-icon {
          font-size: 2.5rem;
          color: #1d4ed8;
        }
        .btn-primary {
          background-color: #1d4ed8;
          border-color: #1d4ed8;
        }
        .btn-primary:hover {
          background-color: #1e40af;
          border-color: #1e40af;
        }
        .btn-outline-light:hover {
          background-color: white;
          color: #1d4ed8;
        }
        .btn-secondary {
          background-color: #4b5563;
          border-color: #4b5563;
        }
        .btn-secondary:hover {
          background-color: #374151;
          border-color: #374151;
        }
        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          .hero-buttons button {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
