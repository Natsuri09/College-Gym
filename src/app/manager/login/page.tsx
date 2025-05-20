'use client';
import { useRouter } from 'next/navigation';
import AuthForm from '../../../../components/Authform';

export default function GymMemberLogin() {
  const router = useRouter();

  return (
    <div className="auth-page-container">
      <div className="auth-box login1-box">
        <h1 className="choose-role-title">Manager Login</h1>
        <p className="choose-role-subtitle">
          Enter your credentials to access the manager portal.
        </p>
        <AuthForm type="login" />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/')}
            className="role-button manager small-button"
          >
            Back to Home
          </button>
         
        </div>
      </div>
    </div>
  );
}
