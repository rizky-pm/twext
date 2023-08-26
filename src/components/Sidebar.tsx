import { signOut } from 'firebase/auth';
import { useNavigate, NavLink } from 'react-router-dom';

import { firebaseAuth } from '../utils/firebase';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    signOut(firebaseAuth)
      .then(() => {
        localStorage.removeItem('user');
        navigate('/sign-in', {
          replace: true,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <nav className='mr-60'>
      <div className='bg-primary text-white flex flex-col w-1/6 h-screen p-4 fixed'>
        <span className='font-extrabold text-3xl p-2 cursor-pointer'>
          twext
        </span>
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
      </div>
    </nav>
  );
};

export default Sidebar;
