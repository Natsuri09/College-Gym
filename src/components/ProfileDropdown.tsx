import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

interface ProfileDropdownProps {
  calories?: number | string;
  onLogout?: () => void;
}

export default function ProfileDropdown({ calories = '', onLogout }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      // Fetch latest user data from DB
      fetch(`/api/user?userId=${parsed.id}`)
        .then(async res => {
          if (!res.ok) throw new Error('Failed to fetch user');
          const data = await res.json();
          setUser((u: any) => ({ ...u, ...data }));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading || !user) return null;

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    router.push('/');
  };

  const profilePic = '/images/default-avatar.png';
  const name = user.name || user.username || 'User';
  const role = user.role;

  return (
    <div className="profile-dropdown" onClick={() => setOpen(!open)} tabIndex={0} onBlur={() => setOpen(false)}>
      <div className="profile-avatar-row">
        <FaUserCircle size={40} className="profile-avatar" />
        <span className="profile-name-navbar">{name}</span>
        <span className="profile-caret">▼</span>
      </div>
      {open && (
        <div className="profile-menu">
          {role?.toLowerCase() === 'manager' ? (
            <>
              <div className="profile-menu-item" onClick={() => router.push('/calories')}>Calories Burned{calories}</div>
              <div className="profile-menu-item" onClick={() => router.push('/manager/add-equipment')}>Add Equipment</div>
              <div className="profile-menu-item" onClick={() => router.push('/manager/manage-members')}>Manage Members</div>
              <div className="profile-menu-item" onClick={() => router.push('/manager/bookings')}>Manage Bookings</div>
            </>
          ) : (
            <>
              <div className="profile-menu-item" onClick={() => router.push('/calories')}>Calories Burned{calories}</div>
              <div className="profile-menu-item" onClick={() => router.push('/gymmember/booking')}>Book Gym</div>
            </>
          )}
          <div className="profile-menu-item logout" onClick={handleLogout}>Logout</div>
        </div>
      )}
    </div>
  );
} 