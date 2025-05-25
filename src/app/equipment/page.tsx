'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../../components/footer';
import ProfileDropdown from '../../components/ProfileDropdown';

// Equipment data
const equipmentItems = [
  {
    id: 1,
    title: 'Treadmills',
    image: '/images/treadmil.png',
    description: 'Our treadmills are equipped with the latest technology to help you achieve your cardio goals.',
    delay: 100
  },
  {
    id: 2,
    title: 'Dumbbells',
    image: '/images/dumbbells.png',
    description: 'Various weights are available for all strength training exercises, from beginners to advanced.',
    delay: 200
  },
  {
    id: 3,
    title: 'Cycling Machines',
    image: '/images/exercisebike.png',
    description: 'Our cycling machines offer a high-intensity workout while being easy on your joints.',
    delay: 300
  },
  {
    id: 4,
    title: 'Dual Cable Cross',
    image: '/images/dualcablecross.png',
    description: 'The Dual Cable Cross is a versatile strength machine with adjustable pulleys for full-body, functional training.',
    delay: 100
  },
  {
    id: 5,
    title: 'Leg Press',
    image: '/images/legpress.png',
    description: 'The Leg Press is a strength machine that targets the lower body by allowing users to push weight away using their legs.',
    delay: 200
  },
  {
    id: 6,
    title: 'Pulley',
    image: '/images/pulley.png',
    description: 'The Pulley machine is a versatile gym equipment that uses adjustable cables for resistance training across various muscle groups.',
    delay: 300
  },
  {
    id: 7,
    title: 'Flat Bench',
    image: '/images/olympic-flat-bench-600x600-1.webp',
    description: 'A sturdy flat bench for various exercises including bench presses, dumbbell exercises, and more.',
    delay: 300
  },
  {
    id: 8,
    title: 'Kettle Bells',
    image: '/images/kettlebellsonrack-420x536.jpg',
    description: 'A cannonball-shaped weight with a handle. The off-center mass works your stabilizing muscles harder.',
    delay: 300
  },
  {
    id: 9,
    title: 'Smith Machine',
    image: '/images/smith machine.jpg',
    description: 'A barbell fixed on vertical rails, allowing vertical movement only. Includes safety hooks to secure the bar at any point by twisting your wrists.',
    delay: 300
  },
  {
    id: 10,
    title: 'Multi Gym-Equipment',
    image: '/images/61ZLH3qnwdL._AC_SL1500_.jpg',
    description: 'A compact all-in-one gym system that allows for multiple strength training exercises: Lat pulldowns, Chest presses, Leg extensions, Seated rows, Bicep curls, Tricep pushdowns.',
    delay: 300
  }
];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [name, setName] = useState('User');
  const [profilePic] = useState('/images/default-avatar.png');
  const [calories] = useState('');
  const role = 'member'; // Simulate role, replace with real logic

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        const href = target.getAttribute('href');
        if (href) {
          document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    const storedName = localStorage.getItem('userName');
    if (storedName) setName(storedName);

    fetch('/api/equipment')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Combine database equipment and hardcoded equipment
          setEquipment([...data, ...equipmentItems]);
        } else {
          setEquipment(equipmentItems);
        }
      })
      .catch(() => setEquipment(equipmentItems));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="equipment">
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
      <section className="equipment-hero position-relative d-flex align-items-center justify-content-center">
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="text-center hero-content w-100" style={{ zIndex: 2 }} data-aos="fade-up">
          <h1 className="mb-3 display-3 fw-bold">CST GYM Equipments</h1>
          <p className="lead">A physical journey of to a strong, buff and inspiring self</p>
          <a href="#gallery" className="px-4 py-2 mt-3 btn btn-primary">
            Get informed about our Equipments
          </a>
        </div>
      </section>

      {/* Equipment Gallery Section */}
      <section id="gallery" className="py-5" data-aos="fade-up">
        <div className="container">
          <h2 className="mb-5 text-center display-4 fw-bold">Our Gym Equipment</h2>
          <div className="row g-4">
            {(equipment.length > 0 ? equipment : equipmentItems).map((item: any) => (
              <div key={`${item.id}-${item.name}`} className="col-md-4 col-sm-6" data-aos="fade-up" data-aos-delay={item.delay}>
                <div className="overflow-hidden border-0 shadow-lg card equipment-card h-100">
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.name || item.title}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title h4">{item.name || item.title}</h3>
                    <p className="card-text">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .equipment {
          min-height: 100vh;
        }
        
        .equipment-hero {
          min-height: 100vh;
          background-image: url('/images/equip.jpg');
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

        .equipment-card {
          transition: transform 0.3s ease;
        }

        .equipment-card:hover {
          transform: translateY(-5px);
        }

        .social-icons a {
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .social-icons a:hover {
          opacity: 0.8;
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