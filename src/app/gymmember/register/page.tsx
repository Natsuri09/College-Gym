'use client';
import { useRouter } from 'next/navigation';
import AuthForm from '../../../../components/Authform';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="auth-page-container">
      <div className="auth-box register-box">
        <h1 className="choose-role-title"> Gym Member Registration</h1>
        <p className="choose-role-subtitle">Create your account below</p>
        <div className="choose-role-form">
          <AuthForm type="register" role="gym-member" />
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/')}
              className="role-button gym-member small-button"
            >
              Back to Home
            </button>
            <button
              onClick={() => router.push('/manager/login')}
              className="role-button gym-member small-button"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
