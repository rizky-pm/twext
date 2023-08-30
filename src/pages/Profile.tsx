import { useParams } from 'react-router-dom';

import useAuthStore from '../state/auth/authStore';

import ProfileContainer from '../components/ProfileContainer';
import ProfilePostList from '../components/ProfilePostList';

const Profile = () => {
  const { user } = useAuthStore();
  const { userId } = useParams();

  const targetUserId = userId || user?.uid;

  return (
    <main>
      {targetUserId && (
        <>
          <ProfileContainer targetUserId={targetUserId} />
          <ProfilePostList targetUserId={targetUserId} />
        </>
      )}
    </main>
  );
};

export default Profile;
