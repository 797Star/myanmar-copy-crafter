import React from 'react';
import { signOutFirebase } from '@/integrations/firebase/auth';

const FirebaseLogout: React.FC = () => {
  const handleLogout = async () => {
    await signOutFirebase();
    window.location.href = '/auth';
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default FirebaseLogout;
