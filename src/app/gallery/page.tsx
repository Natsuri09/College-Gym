'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../../components/footer';
import ProfileDropdown from '../../components/ProfileDropdown';

const carouselImages = [
  {
    src: '/images/gymspace.png',
    alt: 'Gym Space',
    caption: 'Spacious Gym Area',
    desc: 'Clean and open workout environment with state-of-the-art equipment.'
  },
  {
    src: '/images/reception.png',
    alt: 'Reception Area',
    caption: 'Reception Area',
    desc: 'Welcoming space for all members with friendly staff.'
  },
  {
    src: '/images/locker.png',
    alt: 'Locker Area',
    caption: 'Locker Area',
    desc: 'Secure storage for your belongings with personal lockers.'
  }
];

const galleryCards = [
  {
    src: '/images/reception.png',
    alt: 'Reception Area',
    title: 'Reception Area',
    desc: 'The gym reception is the welcoming area where visitors check in, get assistance, and receive information about the gym services.'
  },
  {
    src: '/images/gymspace.png',
    alt: 'Spacious Hallway',
    title: 'Spacious Hallway',
    desc: 'Our spacious hallways connect the different workout zones to provide a smooth experience.'
  },
  {
    src: '/images/cstgym.png',
    alt: 'Functional Training Area',
    title: 'Functional Training Area',
    desc: 'The area is designed for functional workouts, with ample space and equipment for flexibility exercises.'
  },
  {
    src: '/images/locker.png',
    alt: 'Locker',
    title: 'Locker',
    desc: 'The gym locker is a secure space for members to store their personal belongings while they work out.'
  }
];

function TestimonialForm({ onAdd }: any) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<any>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!name || !comment || !photo) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      onAdd({ name, comment, photo: e.target?.result });
      setName('');
      setComment('');
      setPhoto(null);
      if (fileInput.current) fileInput.current.value = '';
    };
    reader.readAsDataURL(photo);
  };

  return (
    <form className="p-4 mb-5 text-white rounded bg-secondary" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Your Name</label>
        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Your Photo</label>
        <input type="file" className="form-control" accept="image/*" ref={fileInput} onChange={e => setPhoto(e.target.files?.[0])} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Your Comment</label>
        <textarea className="form-control" rows={3} value={comment} onChange={e => setComment(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-light">Post Comment</button>
    </form>
  );
}

function TestimonialList({ testimonials, onDelete }: any) {
  return (
    <div className="row">
      {testimonials.map((t: any, idx: number) => (
        <div className="mb-4 col-md-4 testimonial-card" key={idx} data-aos="fade-up">
          <div className="border-0 card h-100 bg-secondary position-relative">
            <div className="p-4 text-center card-body">
              <div className="mb-3">
                <i className="opacity-25 fas fa-quote-left fa-2x"></i>
              </div>
              <p className="mb-4 card-text">{t.comment}</p>
              <div className="d-flex justify-content-center align-items-center">
                <Image src={t.photo} width={120} height={80} alt="Member" style={{ objectFit: 'cover', borderRadius: '0', marginRight: '1rem' }} />
                <div>
                  <h5 className="mb-0">{t.name}</h5>
                  <small className="text-muted">New Member</small>
                </div>
              </div>
            </div>
            <button className="top-0 m-2 btn btn-danger btn-sm position-absolute end-0 delete-btn" onClick={() => onDelete(idx)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const [name, setName] = useState('User');
  const [profilePic] = useState('/images/default-avatar.png');
  const [calories] = useState('');
  const role = 'member';
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const carouselInterval = useRef<any>(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    const storedName = localStorage.getItem('userName');
    if (storedName) setName(storedName);
    // Auto-advance carousel
    carouselInterval.current = setInterval(() => {
      setCarouselIdx(idx => (idx + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(carouselInterval.current);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };
  const handleCarouselNav = (idx: number) => setCarouselIdx(idx);
  const handlePrev = () => setCarouselIdx(idx => (idx - 1 + carouselImages.length) % carouselImages.length);
  const handleNext = () => setCarouselIdx(idx => (idx + 1) % carouselImages.length);
  const handleAddTestimonial = (t: any) => setTestimonials(ts => [...ts, t]);
  const handleDeleteTestimonial = (idx: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(ts => ts.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="gallery-page">
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
      <section className="gallery-hero position-relative d-flex align-items-center justify-content-center">
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="text-center hero-content position-relative w-100" style={{ zIndex: 2 }} data-aos="fade-up">
          <h1 className="mb-3 display-3 fw-bold">CST Gym Through the Lens</h1>
          <p className="lead">A visual journey of our members, machines, and milestones</p>
          <a href="#gallery" className="px-4 py-2 mt-3 btn btn-primary">Explore Gallery</a>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-5 text-white bg-dark" data-aos="fade-up">
        <div className="container">
          <h2 className="mb-5 text-center display-4 fw-bold">Gym Facilities</h2>
          <div className="overflow-hidden shadow-lg gallery-carousel rounded-3 position-relative">
            <div className="carousel-inner">
              {carouselImages.map((img, idx) => (
                <div
                  key={img.src}
                  className={`carousel-item${carouselIdx === idx ? ' active' : ''}`}
                  style={{ display: carouselIdx === idx ? 'block' : 'none', transition: 'opacity 0.5s' }}
                >
                  <Image src={img.src} alt={img.alt} width={1200} height={500} className="d-block w-100" style={{ objectFit: 'cover', width: '100%', height: '400px' }} />
                  <div className="p-3 bg-opacity-75 carousel-caption d-none d-md-block bg-dark rounded-3">
                    <h5>{img.caption}</h5>
                    <p>{img.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" onClick={handlePrev} style={{ left: 0 }}>
              <span className="carousel-control-prev-icon" />
            </button>
            <button className="carousel-control-next" type="button" onClick={handleNext} style={{ right: 0 }}>
              <span className="carousel-control-next-icon" />
            </button>
            <div className="carousel-indicators">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={carouselIdx === idx ? 'active' : ''}
                  onClick={() => handleCarouselNav(idx)}
                  style={{ width: 12, height: 12, borderRadius: '50%', margin: '0 4px', border: 'none', background: carouselIdx === idx ? '#1976d2' : '#bbb' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Cards */}
      <section className="py-3" id="gallery" data-aos="fade-up">
        <div className="container">
          <h2 className="mb-5 text-center display-4 fw-bold">Our Gym Spaces</h2>
          <div className="row g-4">
            {galleryCards.map((card, idx) => (
              <div className="col-lg-6 col-md-6" key={idx} data-aos={idx % 2 === 0 ? 'fade-right' : 'fade-left'}>
                <div className="overflow-hidden border-0 shadow-lg card h-100">
                  <Image src={card.src} className="card-img-top" alt={card.alt} width={800} height={400} style={{ objectFit: 'cover', width: '100%', height: '250px' }} />
                  <div className="card-body">
                    <h3 className="card-title h4">{card.title}</h3>
                    <p className="card-text">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience/Testimonial Section */}
      <section className="py-5 text-white bg-dark" style={{ minHeight: 400 }} data-aos="fade-up">
        <div className="container">
          <h3 className="mb-4 text-center">Share Your Experience</h3>
          <TestimonialForm onAdd={handleAddTestimonial} />
          <TestimonialList testimonials={testimonials} onDelete={handleDeleteTestimonial} />
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .gallery-page {
          min-height: 100vh;
        }
        .gallery-hero {
          min-height: 100vh;
          background-image: url('/images/gallery.png');
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
        .gallery-carousel {
          position: relative;
        }
        .carousel-inner {
          width: 100%;
          position: relative;
        }
        .carousel-item {
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }
        .carousel-item.active {
          position: relative;
          z-index: 2;
        }
        .carousel-control-prev,
        .carousel-control-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.3);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          display: block;
          width: 24px;
          height: 24px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .carousel-control-prev-icon {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M11 2 5 8l6 6'/%3E%3C/svg%3E");
        }
        .carousel-control-next-icon {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M5 2l6 6-6 6'/%3E%3C/svg%3E");
        }
        .carousel-indicators {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }
        .carousel-indicators .active {
          background: #1976d2;
        }
        @media (max-width: 900px) {
          .navbar-title { font-size: 1.1rem; }
          .custom-navbar { padding: 0.5rem 0.5rem; }
          .gallery-hero { min-height: 40vh; }
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
          .gallery-hero {
            min-height: 30vh;
            padding: 2rem 0.5rem;
          }
          .hero-content {
            font-size: 1.1rem;
            padding: 1rem;
          }
          .gallery-carousel img {
            height: 200px !important;
          }
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
      `}</style>
    </div>
  );
} 