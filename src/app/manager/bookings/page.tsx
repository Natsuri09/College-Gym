"use client";
import { useEffect, useState } from "react";
import ProfileDropdown from '../../../components/ProfileDropdown';
import Footer from '../../../components/footer';
import Image from 'next/image';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role?.toLowerCase() !== 'manager') {
        setUnauthorized(true);
        setMessage("Unauthorized: Only managers can access this page.");
        setTimeout(() => window.location.href = '/manager/login', 1500);
        return;
      }
      fetchBookings();
    } else {
      setUnauthorized(true);
      setMessage("Please login as a manager.");
      setTimeout(() => window.location.href = '/manager/login', 1500);
    }
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  const handleAction = async (id: number, status: string) => {
    const res = await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) {
      setMessage(`Booking ${status}`);
      fetchBookings();
    } else {
      setMessage("Action failed");
    }
  };

  return (
    <div className="manager-bookings-page">
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
      <section className="manager-hero d-flex align-items-center justify-content-center position-relative">
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="text-center hero-content w-100" style={{ zIndex: 2 }}>
          <h1 className="mb-3 text-white display-4 fw-bold"><FaClipboardList className="me-2" />Manage Gym Bookings</h1>
          <p className="text-white lead">Approve or reject gym booking requests</p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-11">
            <div className="p-4 rounded shadow card bg-body-tertiary">
              {message && <div className="alert alert-info">{message}</div>}
              {loading ? (
                <div>Loading...</div>
              ) : unauthorized ? null : (
                <div className="table-responsive">
                  <table className="table align-middle table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Member</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr><td colSpan={5} className="text-center">No bookings yet.</td></tr>
                      ) : bookings.map((b: any) => (
                        <tr key={b.id}>
                          <td>{b.user?.name || b.userId}</td>
                          <td>{new Date(b.startTime).toLocaleString()}</td>
                          <td>{new Date(b.endTime).toLocaleString()}</td>
                          <td>
                            {b.status === 'approved' && <span className="text-success"><FaCheckCircle className="me-1" />Approved</span>}
                            {b.status === 'pending' && <span className="text-warning"><FaClock className="me-1" />Pending</span>}
                            {b.status === 'rejected' && <span className="text-danger"><FaTimesCircle className="me-1" />Rejected</span>}
                          </td>
                          <td>
                            {b.status === "pending" && (
                              <>
                                <button className="btn btn-success btn-sm me-2" onClick={() => handleAction(b.id, "approved")}>Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleAction(b.id, "rejected")}>Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .manager-bookings-page {
          min-height: 100vh;
        }
        .manager-hero {
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