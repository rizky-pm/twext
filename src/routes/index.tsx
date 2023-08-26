import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Loader from '../components/Loader';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    loader: Loader,
  },

  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
    loader: Loader,
  },

  {
    path: '/profile/edit',
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    ),
    loader: Loader,
  },

  {
    path: '/sign-in',
    element: <SignIn />,
    loader: Loader,
  },

  {
    path: '/sign-up',
    element: <SignUp />,
    loader: Loader,
  },
]);

export default router;
