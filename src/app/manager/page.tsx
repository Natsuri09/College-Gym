'use client';
import { useRouter } from 'next/navigation';
import { FaUserTie } from 'react-icons/fa';

export default function ManagerLanding() {
  const router = useRouter();
  return (
    <div className="choose-role-container">
      <div className="choose-role-box">
        <FaUserTie className="mb-2 role-icon" />
        <h2 className="choose-role-title">Manager Portal</h2>
        <p className="choose-role-subtitle">Access management features by logging in .</p>
        <div className="choose-role-buttons">
          <button
            onClick={() => router.push('/manager/login')}
            className="role-button manager"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}