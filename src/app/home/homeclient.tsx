'use client'

import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { Container } from 'react-bootstrap'
import Image from 'next/image'
import Footer from '../../components/footer'
import ProfileDropdown from '../../components/ProfileDropdown'

// Simulate user role and data
const user = {
  role: 'member', // change to 'manager' to test manager view
  name: 'John Doe',
  profilePic: '/images/default-avatar.png',
  caloriesBurned: '',
};

const managerData = {
  memberCount: 42,
};

function ProfileBlock({ user, onEdit }: any) {
  return (
    <div className="profile-block">
      <div className="profile-pic-wrapper">
        <Image src={user.profilePic} alt="Profile" width={64} height={64} className="profile-pic" />
        <button className="edit-btn" onClick={onEdit}></button>
      </div>
      <div className="profile-info">
        <div className="profile-name">{user.name}</div>
        <div className="profile-calories">Calories Burned: {user.caloriesBurned}</div>
      </div>
    </div>
  );
}

function ManagerBlock({ managerData, onAddEquipment }: any) {
  return (
    <div className="manager-block">
      <div className="manager-title">Manager Panel</div>
      <div className="manager-members">👥 Members: {managerData.memberCount}</div>
      <button className="add-equip-btn" onClick={onAddEquipment}>+ Add Equipment</button>
    </div>
  );
}

export default function HomeClient() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmiResult, setBmiResult] = useState('')
  const [bmiClass, setBmiClass] = useState('')
  const [showEdit, setShowEdit] = useState(false);
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [name, setName] = useState('User');
  const [calories, setCalories] = useState(user.caloriesBurned);

  // Simulate role (replace with real auth logic)
  const role = user.role;

  useEffect(() => {
    AOS.init()
    const storedName = localStorage.getItem('userName');
    if (storedName) setName(storedName);
  }, [])

  const calculateBMI = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(2)
      let status = ''
      if (+bmi < 18.5) status = 'Underweight'
      else if (+bmi < 25) status = 'Normal weight'
      else if (+bmi < 30) status = 'Overweight'
      else status = 'Obese'

      setBmiResult(`Your BMI is ${bmi} (${status})`)
      setBmiClass('mt-3 fs-5 fw-semibold text-success text-center')
    } else {
      setBmiResult('Please enter valid height and weight.')
      setBmiClass('mt-3 fs-5 fw-semibold text-danger text-center')
    }
  }

  // Edit profile modal logic (simple demo)
  const handleEdit = () => setShowEdit(true);
  const handleSave = () => setShowEdit(false);

  // Manager add equipment (demo)
  const handleAddEquipment = () => alert('Add Equipment Clicked!');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      {/* Custom Home Navbar */}
      <nav className="custom-navbar">
        <ProfileDropdown calories={calories} onLogout={handleLogout} />
        <div className="navbar-left">
          <Image src="/images/cstlogo.png" alt="CST Gym Logo" width={56} height={56} style={{ borderRadius: '50%', marginRight: '1rem' }} />
          <span className="navbar-title">CST Gym</span>
        </div>
        <div className="navbar-links">
          <a href="/home">Home</a>
          <a href="/about">About</a>
          {role === 'manager' && <a href="/calories">Calories Burned</a>}
          <a href="/gallery">Gallery</a>
          <a href="/regulation">Regulation</a>
          <a href="/equipment">Equipments</a>
        </div>
      </nav>
      <div style={{ height: '90px' }} />
      {/* Hero Section */}
      <section
        className="hero flex-grow-1 d-flex flex-column justify-content-center align-items-center"
        data-aos="fade-up"
        style={{ minHeight: '50vh' }}
      >
        <h1>WELCOME TO CST GYM</h1>
        <p>Your fitness journey starts here</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/calories'}>
          JOIN NOW
        </button>
      </section>

      {/* Features Section */}
      <section className="container py-5 features" data-aos="fade-up">
        <h2 className="mb-5 text-center fw-bold">We want you to enjoy your gym session</h2>
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <div className="feature h-100">
              <h3>Equipment and Facilities</h3>
              <p>Our gym is fully equipped with cardio machines, free weights, and more.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="feature h-100">
              <h3>Group Fitness Classes</h3>
              <p>Join exciting group workouts for strength, endurance, and flexibility.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mx-md-auto mx-lg-0">
            <div className="feature h-100">
              <h3>Benefits of Exercising</h3>
              <p>Boost strength, endurance, and maintain a healthy lifestyle with us!</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container my-5 about" data-aos="fade-left">
        <div className="row align-items-center gy-4">
          <div className="order-2 col-lg-6 order-lg-1">
            <h2>About CST Gym</h2>
            <p>
              CST Gym is a fully equipped fitness center designed to support students' health and wellness.
              We offer a variety of workout equipment, including cardio machines, free weights, and strength-training machines.
              Whether you're a beginner or a fitness enthusiast, our space provides a motivating environment to stay active.
              We also offer group workout sessions and personal training guidance to help you reach your fitness goals.
            </p>
          </div>
          <div className="order-1 text-center col-lg-6 order-lg-2">
            <Image 
              src="/images/gymspace.png" 
              alt="Gym Interior" 
              className="rounded shadow img-fluid"
              width={800}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
      </section>

      {/* Timetable Section */}
      <section className="container my-5 timetable" data-aos="zoom-in">
        <h2 className="mb-4 text-center">Gym Timetable</h2>
        <div className="table-responsive">
          <table className="table text-center align-middle table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Day</th>
                <th>Open Hours</th>
                <th>Special Classes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Weekdays</td>
                <td>6AM-10PM</td>
                <td>Yoga, Strength Training</td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>8AM-10PM</td>
                <td>Zumba, HIIT</td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td>Closed</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* BMI Calculator Section */}
      <section className="container my-5 bmi-calculator" data-aos="fade-right">
        <h2 className="text-center">Calculate Your BMI</h2>
        <p className="text-center">Check your Body Mass Index to understand your health better.</p>
        <div className="row justify-content-center g-2">
          <div className="col-6 col-md-3">
            <input
              type="number"
              id="height"
              className="form-control"
              placeholder="Height (cm)"
              min="0"
              value={height}
              onChange={e => setHeight(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <input
              type="number"
              id="weight"
              className="form-control"
              placeholder="Weight (kg)"
              min="0"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3 d-grid">
            <button className="btn btn-primary" onClick={calculateBMI}>
              Calculate BMI
            </button>
          </div>
        </div>
        <p id="bmi-result" className={bmiClass}>
          {bmiResult}
        </p>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 testimonials bg-dark text-light" data-aos="fade-up">
        <div className="container">
          <h2 className="mb-4 text-center">What Our Members Say</h2>
          <div className="flex-wrap gap-4 testimonial-container d-flex justify-content-center">
            <div className="p-3 rounded testimonial bg-secondary" style={{ maxWidth: 400 }}>
              <p>"Great gym with amazing trainers. I feel healthier and more energetic!"</p>
              <strong>- Sonam T.</strong>
            </div>
            <div className="p-3 rounded testimonial bg-secondary" style={{ maxWidth: 400 }}>
              <p>"The group classes are fun and motivating. I love coming here!"</p>
              <strong>- Dechen W.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-5 text-white newsletter bg-secondary" data-aos="zoom-in">
        <div className="container text-center">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Stay updated with the latest gym news and tips.</p>
          <form
            className="gap-2 mt-3 d-flex justify-content-center flex-column flex-sm-row"
            onSubmit={e => {
              e.preventDefault()
              alert('Subscribed successfully!')
            }}
          >
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Your email"
              required
            />
            <button type="submit" className="btn btn-primary btn-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>
      <Footer />
      <style jsx global>{`
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem 2rem 0 2rem;
          gap: 1rem;
        }
        .profile-block, .manager-block {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 220px;
        }
        .profile-pic-wrapper {
          position: relative;
        }
        .profile-pic {
          border-radius: 50%;
        }
        .edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #eee;
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          cursor: pointer;
        }
        .profile-info {
          display: flex;
          flex-direction: column;
        }
        .profile-name {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .profile-calories {
          font-size: 0.95rem;
          color: #0070f3;
        }
        .manager-block {
          flex-direction: column;
          align-items: flex-end;
        }
        .manager-title {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .manager-members {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .add-equip-btn {
          background: #0070f3;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1.2rem;
          font-weight: 600;
          cursor: pointer;
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
    </>
  )
}
