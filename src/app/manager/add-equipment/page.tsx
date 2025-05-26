"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../../../components/footer';
import ProfileDropdown from '../../../components/ProfileDropdown';

export default function AddEquipmentPage() {
  const [name, setName] = useState('User');
  const [profilePic] = useState('/images/default-avatar.png');
  const [calories] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });

    // Get the user object from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      // Check if the user's role is 'manager'
      setIsManager(parsed.role?.toLowerCase() === 'manager');
      setName(parsed.name || 'User');
    }

    // Only fetch equipment if the user is a manager
    if (isManager) {
      fetch('/api/equipment')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setEquipmentList(data);
        });
    }
  }, [isManager, message]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elements = e.currentTarget.elements as typeof e.currentTarget.elements & {
      name: HTMLInputElement;
      description: HTMLTextAreaElement;
      quantity: HTMLInputElement;
      status: HTMLSelectElement;
    };
    const formData = new FormData();
    formData.append('name', elements.name.value);
    formData.append('description', elements.description.value);
    formData.append('quantity', elements.quantity.value);
    formData.append('status', elements.status.value);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await fetch('/api/equipment', {
      method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Equipment added successfully!');
        e.currentTarget.reset();
        setSelectedImage(null);
        setPreviewUrl('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to add equipment. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;
    const res = await fetch(`/api/equipment/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setEquipmentList(equipmentList => equipmentList.filter(eq => eq.id !== id));
      setMessage('Equipment deleted.');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('Failed to delete equipment.');
      setTimeout(() => setMessage(''), 2000);
    }
  };
// If the user is not a manager, show an unauthorized message and prevent access
  if (!isManager) {
    return (
      <div className="add-equipment-page">
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
        <div className="container py-5">
          <h2>Unauthorized</h2>
          <p>Only managers can add equipment.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="add-equipment-page">
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
      <section className="text-center equipment-hero d-flex align-items-center justify-content-center position-relative">
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="hero-content w-100" style={{ zIndex: 2 }} data-aos="fade-up">
          <h1 className="mb-3 display-3 fw-bold">Add Equipment</h1>
          <p className="lead">Add new equipment to the gym inventory</p>
        </div>
      </section>

      {/* Add Equipment Form */}
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                {message}
              </div>
            )}
            <div className="shadow card">
              <div className="p-4 card-body">
                <h2 className="mb-4 card-title">Add New Equipment</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Equipment Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      required
                      placeholder="Enter equipment name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows={3}
                      required
                      placeholder="Enter equipment description"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      required
                      min="1"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select className="form-select" id="status" name="status" required>
                      <option value="">Select status</option>
                      <option value="available">Available</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="out_of_order">Out of Order</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Equipment Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={200}
                          height={200}
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Add Equipment
                  </button>
      </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manager Equipment List */}
      {isManager && (
        <section className="container py-5">
          <h2 className="mb-4">Manage Existing Equipment</h2>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {equipmentList.map(eq => (
                  <tr key={eq.id}>
                    <td>{eq.name}</td>
                    <td>{eq.description}</td>
                    <td>{eq.quantity}</td>
                    <td>{eq.status}</td>
                    <td>
                      {eq.imageUrl && (
                        <img src={eq.imageUrl} alt={eq.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                      )}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEquipment(eq.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Footer />

      <style jsx global>{`
        .add-equipment-page {
          min-height: 100vh;
        }
        .equipment-hero {
          height: 100vh;
          background-image: url('/images/equiinsert.jpg');
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
          .navbar-title { font-size: 1.3rem; }
          .custom-navbar { padding: 0.5rem 0.5rem; }
          .equipment-hero { min-height: 30vh; }
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
          .equipment-hero {
            min-height: 25vh;
            padding: 2rem 0.5rem;
          }
          .hero-content {
            font-size: 1.1rem;
            padding: 1rem;
          }
        }
        .table-responsive { margin-top: 2rem; }
        .table img { border: 1px solid #eee; }
      `}</style>
    </div>
  );
} 