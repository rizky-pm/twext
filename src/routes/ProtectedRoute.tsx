import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { firebaseAuth } from '../utils/firebase';
import Sidebar from '../components/Sidebar';
import useAuthStore from '../state/auth/authStore';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { user, setUser } = useAuthStore();

  const currentUser = localStorage.getItem('user');

  console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (userCredential) => {
      if (userCredential) {
        localStorage.setItem('user', JSON.stringify(userCredential));
        setUser(userCredential);
      } else {
        localStorage.removeItem('user');
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!currentUser) {
    return <Navigate to={'/sign-in'} />;
  }

  return (
    <main className='flex ml-[16.666667%]'>
      <Sidebar />
      <section className='p-4 w-3/6'>{children}</section>
    </main>
  );
};

export default ProtectedRoute;
