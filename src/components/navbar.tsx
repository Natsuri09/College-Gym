import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/" className="brand-link">
          College Gym
        </Link>
      </div>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link
              href="/equipment"
              className={`nav-link ${isActive('/equipment') ? 'active' : ''}`}
            >
              Equipment
            </Link>
            {user?.role === 'manager' && (
              <>
                <Link
                  href="/manager/add-equipment"
                  className={`nav-link ${isActive('/manager/add-equipment') ? 'active' : ''}`}
                >
                  Add Equipment
                </Link>
                <Link
                  href="/manager/manage-members"
                  className={`nav-link ${isActive('/manager/manage-members') ? 'active' : ''}`}
                >
                  Manage Members
                </Link>
              </>
            )}
            <Link
              href="/calories"
              className={`nav-link ${isActive('/calories') ? 'active' : ''}`}
            >
              Calories
            </Link>
            <ProfileDropdown />
          </>
        ) : (
          <>
            <Link
              href="/gymmember/login"
              className={`nav-link ${isActive('/gymmember/login') ? 'active' : ''}`}
            >
              Member Login
            </Link>
            <Link
              href="/manager/login"
              className={`nav-link ${isActive('/manager/login') ? 'active' : ''}`}
            >
              Manager Login
            </Link>
          </>
        )}
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-brand {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .brand-link {
          color: #333;
          text-decoration: none;
          transition: color 0.2s;
        }

        .brand-link:hover {
          color: #007bff;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .nav-link:hover {
          color: #007bff;
          background-color: rgba(0, 123, 255, 0.1);
        }

        .nav-link.active {
          color: #007bff;
          background-color: rgba(0, 123, 255, 0.1);
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
          }

          .nav-links {
            gap: 1rem;
          }

          .nav-link {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </nav>
  );
}
