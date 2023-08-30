import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { firebaseStorage, firestore } from '../utils/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';

type UserProfileType = {
  bio: string;
  avatarURL: string;
  headerURL: string;
  displayName: string;
  emailAddress: string;
};

type Props = {
  targetUserId: string;
};

const ProfileContainer = ({ targetUserId }: Props) => {
  const [userProfile, setUserProfile] = useState<UserProfileType>({
    bio: '',
    avatarURL: '',
    headerURL: '',
    displayName: '',
    emailAddress: '',
  });

  const navigate = useNavigate();
  const { userId } = useParams();

  const getUserProfile = async () => {
    if (targetUserId) {
      const userDetailRef = doc(firestore, 'userDetail', targetUserId);
      const userDetailSnap = await getDoc(userDetailRef);
      const userDetail = userDetailSnap.data();
      const avatarRef = ref(firebaseStorage, `${targetUserId}/avatar`);
      const headerRef = ref(firebaseStorage, `${targetUserId}/header`);

      if (avatarRef) {
        getDownloadURL(avatarRef).then((url) => {
          setUserProfile((prevState) => ({ ...prevState, avatarURL: url }));
        });
      }

      if (headerRef) {
        getDownloadURL(headerRef)
          .then((url) => {
            setUserProfile((prevState) => ({ ...prevState, headerURL: url }));
          })
          .catch((e) => {
            console.log(e);
          });
      }

      setUserProfile((prevState) => ({
        ...prevState,
        bio: userDetail?.bio,
        displayName: userDetail?.displayName,
        emailAddress: userDetail?.emailAddress,
      }));
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [targetUserId]);

  return (
    <section className='border-2 rounded-md flex flex-col pb-4'>
      {userProfile.headerURL ? (
        <div className='profile-header bg-slate-500 h-48 rounded-t-md overflow-hidden'>
          <img
            src={userProfile.headerURL}
            alt=''
            className='object-cover w-full h-full'
          />
        </div>
      ) : (
        <div className='profile-header bg-slate-600 h-48 rounded-t-md overflow-hidden'></div>
      )}

      <div className='flex justify-between items-center mx-4'>
        {userProfile.avatarURL ? (
          <div className='profile-picture rounded-full bg-slate-800 w-24 h-24 -mt-12 overflow-hidden'>
            <img
              src={userProfile.avatarURL}
              alt=''
              className='object-cover w-full h-full'
            />
          </div>
        ) : (
          <div className='profile-picture rounded-full bg-slate-800 w-24 h-24 -mt-12 overflow-hidden'></div>
        )}
        {!userId && (
          <button
            onClick={() => {
              navigate('/profile/edit');
            }}
            className='p-2 font-semibold text-sm rounded bg-primary hover:bg-primary-light transition text-white ml-auto'
          >
            Edit Profile
          </button>
        )}
      </div>

      <span className='mx-4 font-bold text-2xl mt-2'>
        {userProfile?.displayName}
      </span>
      <span className='mx-4 text-sm'>{userProfile?.emailAddress}</span>
      <p className='mx-4 mt-2'>{userProfile.bio}</p>

      <div className='mx-4 mt-4 font-semibold flex justify-between items-center w-2/5'>
        <span>69 Followers</span>
        <span>420 Followings</span>
      </div>
    </section>
  );
};

export default ProfileContainer;
