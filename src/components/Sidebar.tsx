import { signOut } from 'firebase/auth';
import { useNavigate, NavLink } from 'react-router-dom';

import { firebaseAuth } from '../utils/firebase';
import useAuthStore from '../state/auth/authStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSignOut = async () => {
    signOut(firebaseAuth)
      .then(() => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/sign-in', {
          replace: true,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <nav className='bg-primary text-white flex flex-col w-1/6 h-screen p-4 fixed left-0'>
      <span className='font-extrabold text-3xl p-2 cursor-pointer'>twext</span>
      <NavLink to={'/'} className='sidebar-menu'>
        <span>Home</span>
      </NavLink>
      <NavLink to={'/notification'} className='sidebar-menu'>
        <span>Notification</span>
      </NavLink>
      <NavLink to={'/profile'} className='sidebar-menu'>
        <span>Profile</span>
      </NavLink>
      <span
        onClick={handleSignOut}
        className='mt-auto hover:text-primary hover:bg-white p-2 rounded cursor-pointer font-bold transition'
      >
        Logout
      </span>
    </nav>
  );
};

export default Sidebar;
