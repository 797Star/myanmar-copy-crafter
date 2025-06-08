import React from 'react';
import FirebaseLogin from '@/components/FirebaseLogin';

// You can keep the old UI as a fallback or for future use if needed
// import { Bot, Sparkles } from 'lucide-react';
// import LoginForm from '@/components/auth/LoginForm';
// import SignUpForm from '@/components/auth/SignUpForm';

const AuthPage: React.FC = () => (
  <div style={{ maxWidth: 400, margin: 'auto', padding: 32 }}>
    <h2>Sign in with Firebase</h2>
    <FirebaseLogin />
  </div>
);

export default AuthPage;
