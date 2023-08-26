import { useNavigate } from 'react-router-dom';

import { firebaseAuth } from '../utils/firebase';

const ProfileContainer = () => {
  const navigate = useNavigate();

  return (
    <section className='border-2 rounded-md flex flex-col pb-4'>
      <div className='profile-header bg-slate-500 h-48 rounded-t-md'></div>

      <div className='flex justify-between items-center mx-4'>
        <div className='profile-picture rounded-full bg-slate-800 w-20 h-20 -mt-8'></div>
        <button
          onClick={() => {
            navigate('/profile/edit');
          }}
          className='p-2 font-semibold text-sm rounded bg-primary hover:bg-primary-light transition text-white ml-auto'
        >
          Edit Profile
        </button>
      </div>

      <span className='mx-4 font-bold text-2xl'>Display Name</span>
      <span className='mx-4'>{firebaseAuth.currentUser?.email}</span>
      <p className='mx-4 mt-2'>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam ratione
        illum reprehenderit neque dolorum odit sequi obcaecati in iusto,
        necessitatibus quasi velit veritatis assumenda fugiat, at fugit aut!
        Sunt, in.
      </p>

      <div className='mx-4 mt-2 text-sm font-semibold flex justify-between items-center w-2/5'>
        <span>69 Followers</span>
        <span>420 Followings</span>
      </div>
    </section>
  );
};

export default ProfileContainer;
