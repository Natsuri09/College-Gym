'use client';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

export default function GymMemberLanding() {
  const router = useRouter();
  return (
    <div className="choose-role-container">
      <div className="choose-role-box">
        <FaUser className="mb-2 role-icon" />
        <h2 className="choose-role-title">Gym Member Portal</h2>
        <p className="choose-role-subtitle">Login or register to access your gym account.</p>
        <div className="choose-role-buttons">
          <button
            onClick={() => router.push('/gymmember/login')}
            className="role-button gym-member"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/gymmember/register')}
            className="role-button gym-member"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}