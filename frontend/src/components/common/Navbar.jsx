'use client';

import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>AI Website Builder</h2>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => router.push('/login')}>Login</button>
            <button onClick={() => router.push('/signup')}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}
