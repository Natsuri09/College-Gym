"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarPlus, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ProfileDropdown from '../../../components/ProfileDropdown';
import Footer from '../../../components/footer';
import Image from 'next/image';

export default function MemberBookingPage() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed.id);
      if (!['gym-member', 'member'].includes(parsed.role?.toLowerCase())) {
        setMessage("Unauthorized: Only gym members can book the gym.");
        setTimeout(() => router.push('/gymmember/login'), 1500);
        return;
      }
      fetchBookings(parsed.id);
    } else {
      setMessage("Please login as a gym member.");
      setTimeout(() => router.push('/gymmember/login'), 1500);
    }
  }, []);

  const fetchBookings = async (uid: string) => {
    const res = await fetch(`/api/bookings?userId=${uid}`);
    const data = await res.json();
    setBookings(data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!startTime || !endTime) return setMessage("Please select start and end time.");
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, startTime, endTime })
    });
    if (res.ok) {
      setMessage("Booking request sent!");
      setStartTime("");
      setEndTime("");
      fetchBookings(userId);
    } else {
      const err = await res.json();
      setMessage(err.error || "Booking failed");
    }
  };

  return (
    <div className="booking-page">
      {/* Custom Navbar */}
      <nav className="custom-navbar">
        <ProfileDropdown />
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
      <section className="booking-hero d-flex align-items-center justify-content-center position-relative">
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="text-center hero-content w-100" style={{ zIndex: 2 }}>
          <h1 className="mb-3 text-white display-4 fw-bold"><FaCalendarPlus className="me-2" />Book the Gym</h1>
          <p className="text-white lead">Reserve your workout slot easily</p>
        </div>
      </section>

      {/* Booking Form Card */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="p-4 mb-5 rounded shadow card bg-body-tertiary">
              <h3 className="mb-4 fw-semibold">Book a Slot</h3>
              {message && <div className="alert alert-info">{message}</div>}
              <form onSubmit={handleSubmit} className="mb-3">
                <div className="mb-3">
                  <label className="form-label">Start Time</label>
                  <input type="datetime-local" className="form-control" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Time</label>
                  <input type="datetime-local" className="form-control" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                </div>
                <button className="btn btn-primary w-100" type="submit"><FaClock className="me-2" />Book</button>
              </form>
            </div>
          </div>
        </div>

        {/* Bookings Table Card */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="p-4 rounded shadow card bg-body-tertiary">
              <h4 className="mb-3 fw-semibold">Your Bookings</h4>
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Start</th>
                      <th>End</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr><td colSpan={3} className="text-center">No bookings yet.</td></tr>
                    ) : bookings.map((b: any) => (
                      <tr key={b.id}>
                        <td>{new Date(b.startTime).toLocaleString()}</td>
                        <td>{new Date(b.endTime).toLocaleString()}</td>
                        <td>
                          {b.status === 'approved' && <span className="text-success"><FaCheckCircle className="me-1" />Approved</span>}
                          {b.status === 'pending' && <span className="text-warning"><FaClock className="me-1" />Pending</span>}
                          {b.status === 'rejected' && <span className="text-danger"><FaTimesCircle className="me-1" />Rejected</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .booking-page {
          min-height: 100vh;
        }
        .booking-hero {
          height: 100vh;
          background-image: url('/images/gallery.png');
          background-size: cover;
          background-position: center;
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
        .card {
          border-radius: 1.2rem;
        }
        .table {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
} 