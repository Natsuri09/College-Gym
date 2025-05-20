'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../../components/footer';
import Chart from 'chart.js/auto';
import ProfileDropdown from '../../components/ProfileDropdown';

const activityRates: Record<string, number> = {
  treadmill: 8,
  dumbbells: 4.5,
  cyclingMachine: 7.5,
  dualCableCross: 6,
  legPress: 5.5,
  pulley: 6,
  flatBench: 5.5,
  kettlebells: 10.5,
  smithMachine: 5.5,
  multiGym: 8.5,
  running: 10,
  jogging: 8,
  cycling: 7,
  swimming: 9,
  walking: 4,
  jumpingRope: 12
};

const activityOptions = [
  { value: '', label: 'Choose an activity' },
  { value: 'treadmill', label: 'Treadmill' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'cyclingMachine', label: 'Cycling Machine' },
  { value: 'dualCableCross', label: 'Dual Cable Cross' },
  { value: 'legPress', label: 'Leg Press' },
  { value: 'pulley', label: 'Pulley' },
  { value: 'flatBench', label: 'Flat Bench' },
  { value: 'kettlebells', label: 'Kettlebells' },
  { value: 'smithMachine', label: 'Smith Machine' },
  { value: 'multiGym', label: 'Multi Gym Equipment' },
  { value: 'running', label: 'Running' },
  { value: 'jogging', label: 'Jogging' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'walking', label: 'Walking' },
  { value: 'jumpingRope', label: 'Jumping Rope' },
];

function formatActivityName(activity: string) {
  const map: Record<string, string> = {
    treadmill: 'Treadmill',
    dumbbells: 'Dumbbells',
    cyclingMachine: 'Cycling Machine',
    dualCableCross: 'Dual Cable Cross',
    legPress: 'Leg Press',
    pulley: 'Pulley',
    flatBench: 'Flat Bench',
    kettlebells: 'Kettlebells',
    smithMachine: 'Smith Machine',
    multiGym: 'Multi Gym Equipment',
    running: 'Running',
    jogging: 'Jogging',
    cycling: 'Cycling',
    swimming: 'Swimming',
    walking: 'Walking',
    jumpingRope: 'Jumping Rope',
  };
  return map[activity] || activity;
}

export default function CaloriesPage() {
  const [name, setName] = useState('User');
  const [profilePic] = useState('/images/default-avatar.png');
  const [calories, setCalories] = useState(0);
  const [role, setRole] = useState('member');
  const [activityLabels, setActivityLabels] = useState<string[]>([]);
  const [caloriesData, setCaloriesData] = useState<number[]>([]);
  const [bgColors, setBgColors] = useState<string[]>([]);
  const [entries, setEntries] = useState<any[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.id);
      setName(parsed.name || 'User');
      setRole(parsed.role || 'member');
    }
  }, []);

  // Fetch previous entries
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/calories?userId=${userId}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setEntries(data);
        setActivityLabels(data.map((e: any) => `${formatActivityName(e.activity)} (${e.date})`));
        setCaloriesData(data.map((e: any) => e.calories));
        setBgColors(data.map(() => getRandomColor()));
        // Calculate total calories burned
        const total = data.reduce((sum: number, entry: any) => sum + entry.calories, 0);
        setCalories(total);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setEntries([]);
        setActivityLabels([]);
        setCaloriesData([]);
        setBgColors([]);
        setCalories(0);
      });
  }, [userId]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: activityLabels,
        datasets: [{
          label: 'Calories Burned',
          data: caloriesData,
          backgroundColor: bgColors.length ? bgColors : [
            '#ff6384', '#36a2eb', '#ffcd56',
            '#4bc0c0', '#9966ff', '#ff9f40',
            '#8A2BE2', '#FF4500', '#2E8B57',
            '#DAA520', '#20B2AA', '#FF69B4',
            '#708090', '#00CED1', '#FF6347',
            '#9ACD32', '#FF1493', '#4682B4',
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#222'
            }
          }
        }
      }
    });
  }, [activityLabels, caloriesData, bgColors]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const date = e.target.activityDate.value;
    const activity = e.target.activity.value;
    const duration = parseInt(e.target.duration.value);
    if (activity && duration && activityRates[activity] && userId) {
      const caloriesBurned = activityRates[activity] * duration;
      // Save to DB
      const res = await fetch('/api/calories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, date, activity, duration, calories: caloriesBurned })
      });
      const newEntry = await res.json();
      setEntries(prev => [newEntry, ...prev]);
      setActivityLabels(labels => [`${formatActivityName(activity)} (${date})`, ...labels]);
      setCaloriesData(data => [caloriesBurned, ...data]);
      setBgColors(colors => [getRandomColor(), ...colors]);
      setCalories(prev => prev + caloriesBurned);
      e.target.reset();
    }
  };

  function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 70%)`;
  }

  return (
    <div className="calories-page">
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
      <section className="text-center calories-hero d-flex align-items-center justify-content-center position-relative">
        <div className="hero-overlay position-absolute w-100 h-100"></div>
        <div className="hero-content w-100" style={{ zIndex: 2 }} data-aos="fade-up">
          <h1 className="mb-3 display-3 fw-bold">Calories Tracker</h1>
          <p className="lead">Track your workout</p>
        </div>
      </section>

      {/* Calorie Tracker */}
      <section className="container py-5">
        <div className="container">
          <h1 className="mb-2 fw-bold display-5">Track Your Burn</h1>
          <p className="mb-4 lead">Monitor how many calories you've burned during your workouts</p>
          <div className="row g-4">
            {/* Form */}
            <div className="col-lg-6">
              <div className="p-4 shadow card bg-body-tertiary">
                <h4 className="mb-4 fw-semibold">Calories Burned Tracker</h4>
                <form id="calorieForm" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="activityDate">Date</label>
                    <input type="date" className="form-control" id="activityDate" name="activityDate" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="activity">Activity</label>
                    <select className="form-select" id="activity" name="activity" required>
                      {activityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="duration">Duration (minutes)</label>
                    <input type="number" className="form-control" id="duration" name="duration" placeholder="e.g. 30" required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Add Activity</button>
                </form>
              </div>
            </div>
            {/* Chart */}
            <div className="col-lg-6">
              <div className="p-4 shadow card bg-body-tertiary h-100 d-flex align-items-center justify-content-center">
                <canvas ref={chartRef} style={{ maxWidth: '100%', height: 'auto' }} />
              </div>
            </div>
          </div>
          {/* Previous Entries Table */}
          <div className="mt-5">
            <h3 className="mb-3">Previous Calories Burned</h3>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Duration (min)</th>
                    <th>Calories Burned</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={entry._id || idx}>
                      <td>{entry.date}</td>
                      <td>{formatActivityName(entry.activity)}</td>
                      <td>{entry.duration}</td>
                      <td>{entry.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .calories-page {
          min-height: 100vh;
        }
        .calories-hero {
          height: 100vh;
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
          .calories-hero { min-height: 30vh; }
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
          .calories-hero {
            min-height: 25vh;
            padding: 2rem 0.5rem;
          }
          .hero-content {
            font-size: 1.1rem;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 