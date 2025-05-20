'use client';

import { useRouter } from 'next/navigation';
import { FaUser, FaUserTie } from 'react-icons/fa6';

const Home = () => {
  const router = useRouter();

  const handleSelect = (role: string) => {
    // Navigate to the role-specific landing page
    if (role === 'GymMember') {
      router.push('/gymmember');
    } else if (role === 'Manager') {
      router.push('/manager');
    }
  };

  return (
    <div className="choose-role-container">
      <div className="choose-role-box">
        <h1 className="choose-role-title">Welcome!</h1>
        <p className="choose-role-subtitle">Please select your role to continue</p>
        <div className="choose-role-buttons">
          <button 
            className="role-button gym-member" 
            onClick={() => handleSelect('GymMember')}
          >
            <FaUser className="role-icon" />
            Gym Member
          </button>
          <button 
            className="role-button manager" 
            onClick={() => handleSelect('Manager')}
          >
            <FaUserTie className="role-icon" />
            Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
