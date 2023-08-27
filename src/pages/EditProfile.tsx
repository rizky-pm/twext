import { useEffect, useState, useRef } from 'react';
import { Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import { firestore } from '../utils/firebase';
import useAuthStore from '../state/auth/authStore';

import UpladAvatarIcon from '../assets/UploadAvatarIcon';

type EditProfileValues = {
  displayName: string;
  bio: string;
  photoURL: string;
};

const EditProfile = () => {
  const [detail, setDetail] = useState<EditProfileValues>({
    displayName: '',
    bio: '',
    photoURL: '',
  });
  const [isAvatarTooltipOpen, setIsAvatarTooltipOpen] =
    useState<boolean>(false);

  const inputAvatarRef = useRef<HTMLInputElement | null>(null);
  const inputHeaderRef = useRef<HTMLInputElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuthStore();

  const { register, formState, handleSubmit, reset } =
    useForm<EditProfileValues>({
      defaultValues: {
        displayName: '',
        bio: '',
        photoURL: '',
      },
    });

  const { isSubmitting, errors } = formState;

  const handleEditProfile = async (data: EditProfileValues) => {
    const { bio, displayName, photoURL } = data;

    if (!user) {
      return;
    }

    const promises = [];

    if (displayName && displayName !== user.displayName) {
      promises.push(updateProfile(user, { displayName }));
    }

    if (photoURL && photoURL !== user.photoURL) {
      promises.push(updateProfile(user, { photoURL }));
    }

    if (bio) {
      const userDetailRef = doc(firestore, 'userDetail', user.uid);
      promises.push(updateDoc(userDetailRef, { bio }));
    }

    if (promises.length > 0) {
      await Promise.all(promises);

      // Update state if necessary
      setDetail((prevState) => ({
        ...prevState,
        displayName: displayName || prevState.displayName,
        bio: bio || prevState.bio,
      }));

      reset();
    }
  };

  const getUserDetail = async () => {
    if (user) {
      const detailRef = doc(firestore, 'userDetail', user?.uid);
      const detailSnap = await getDoc(detailRef);
      const userDetail = detailSnap.data();

      setDetail({
        displayName: user.displayName || '',
        bio: userDetail?.bio || '',
        photoURL: user.photoURL || '',
      });
    }
  };

  const inputAvatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
  };

  useEffect(() => {
    getUserDetail();
  }, [user]);

  useEffect(() => {
    // Event handler to close the dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsAvatarTooltipOpen(false);
      }
    };

    // Attach the event listener to the document
    document.addEventListener('click', handleClickOutside);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <section className='border-2 rounded-md flex flex-col p-4'>
      <h1 className='font-bold text-xl mb-2'>Edit Profile</h1>

      <form onSubmit={handleSubmit(handleEditProfile)} noValidate>
        <Stack spacing={2}>
          <div className='flex space-x-2'>
            {/* AVATAR SECTION */}
            <div className='relative self-start'>
              <button
                className='rounded-full cursor-pointer bg-red-500 w-36 h-36 fill-transparent overflow-hidden'
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  setIsAvatarTooltipOpen(true);
                }}
              >
                <span className='opacity-75 transition bg-stone-800 hover:bg-stone-950 w-full h-full flex justify-center items-center'>
                  <UpladAvatarIcon
                    className='stroke-white w-10 h-10'
                    fill='fill-white'
                  />
                </span>
              </button>
              <input
                ref={inputAvatarRef}
                type='file'
                name='avatar'
                id='avatar'
                className='hidden'
                onChange={(e) => {
                  inputAvatarHandler(e);
                }}
              />

              <div
                ref={tooltipRef}
                className={`h-auto w-auto z-10 absolute top-1/2 -translate-y-1/2 -right-36 text-left flex ${
                  isAvatarTooltipOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                } flex-col rounded overflow-hidden transition main-box-shadow bg-neutral-50 bg-opacity-90`}
              >
                <span
                  className='p-2 transition cursor-pointer hover:bg-neutral-200'
                  onClick={() => {
                    if (inputAvatarRef) {
                      inputAvatarRef.current?.click();
                    }
                  }}
                >
                  Upload avatar
                </span>
                <span className='p-2 transition cursor-pointer hover:bg-neutral-200'>
                  Remove avatar
                </span>
              </div>
            </div>
            {/* HEADER SECTION */}
            <div className='flex w-full border-2'>
              <button
                className='cursor-pointer flex-grow h-36 bg-stone-800 rounded'
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                }}
              >
                <span className='font-bold text-xl text-white bg-red-500 w-full h-full'>
                  Change header
                </span>
              </button>
              <input
                ref={inputHeaderRef}
                type='file'
                name='header'
                id='header'
                className='hidden'
                onChange={(e) => {
                  inputAvatarHandler(e);
                }}
              />
            </div>
          </div>

          <TextField
            id='displayName'
            placeholder={detail.displayName || 'Display Name'}
            variant='outlined'
            size='small'
            type='text'
            fullWidth
            {...register('displayName')}
          />

          <TextField
            id='filled-multiline-flexible'
            placeholder={detail.bio || 'Write interesting bio'}
            multiline
            fullWidth
            rows={4}
            {...register('bio')}
            error={!!errors.bio}
            helperText={errors.bio?.message}
          />

          <button
            disabled={isSubmitting}
            className='primary-button'
            type='submit'
          >
            Edit
          </button>
        </Stack>
      </form>
    </section>
  );
};

export default EditProfile;
