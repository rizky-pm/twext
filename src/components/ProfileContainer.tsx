import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, getDownloadURL } from 'firebase/storage';
import { deleteDoc, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

import { firebaseStorage, firestore } from '../utils/firebase';
import useAuthStore from '../state/auth/authStore';

type UserProfileType = {
  bio: string;
  avatarURL: string;
  headerURL: string;
  displayName: string;
  emailAddress: string;
  isFollowed: boolean;
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
    isFollowed: false,
  });

  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuthStore();

  const getUserProfile = async () => {
    if (targetUserId && user?.uid) {
      const userDetailRef = doc(firestore, 'userDetail', targetUserId);
      const userDetailSnap = await getDoc(userDetailRef);
      const userDetail = userDetailSnap.data();
      const avatarRef = ref(firebaseStorage, `${targetUserId}/avatar`);
      const headerRef = ref(firebaseStorage, `${targetUserId}/header`);

      const followerDocRef = doc(
        firestore,
        'userDetail',
        user?.uid,
        'followers',
        targetUserId
      );
      const followerSnap = await getDoc(followerDocRef);

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
        isFollowed: followerSnap.exists(),
      }));
    }
  };

  const followUserHandler = async () => {
    if (user && userId) {
      // Follow user
      if (!userProfile.isFollowed) {
        const userRef = doc(firestore, 'userDetail', user?.uid);
        const followerDocRef = doc(userRef, 'followers', userId);
        // const followerRef = doc(firestore, 'userDetail', userId);

        const followerData = {
          displayName: userProfile.displayName,
          emailAddress: userProfile.emailAddress,
          followedAt: Timestamp.now(),
        };

        try {
          await setDoc(followerDocRef, followerData);
          console.log('Success following ', userId);
          setUserProfile((prevState) => ({
            ...prevState,
            isFollowed: true,
          }));
        } catch (error) {
          console.log(error);
        }
      }

      // Unfollow user
      if (userProfile.isFollowed) {
        const followerDocRef = doc(
          firestore,
          'userDetail',
          user?.uid,
          'followers',
          targetUserId
        );

        try {
          await deleteDoc(followerDocRef);
          setUserProfile((prevState) => ({
            ...prevState,
            isFollowed: false,
          }));
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [targetUserId, user]);

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
        {userId === undefined ? (
          <button
            onClick={() => {
              navigate('/profile/edit');
            }}
            className='p-2 font-semibold text-sm rounded bg-primary hover:bg-primary-light transition text-white ml-auto'
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={followUserHandler}
            className={`p-2 font-semibold text-sm rounded bg-primary hover:bg-primary-light ${
              userProfile.isFollowed
                ? 'border-2 border-primary bg-white text-primary hover:text-white hover:bg-primary'
                : 'text-white'
            } transition ml-auto`}
          >
            {userProfile.isFollowed ? 'Followed' : 'Follow'}
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
