import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';

const AuthPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleMode = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '32px 16px' }}>
      {showLogin ? (
        <LoginForm onToggleMode={toggleMode} />
      ) : (
        <SignUpForm onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default AuthPage;
