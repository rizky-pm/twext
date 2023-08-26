import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { firebaseAuth } from '../utils/firebase';
import Sidebar from '../components/Sidebar';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const user = localStorage.getItem('user');

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log(user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
  }, []);

  console.log({ user });

  if (!user) {
    return <Navigate to={'/sign-in'} />;
  }

  return (
    <main className='flex'>
      <Sidebar />
      <section className='p-4 w-3/6'>{children}</section>
    </main>
  );
};

export default ProtectedRoute;
