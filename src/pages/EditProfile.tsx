import { useEffect, useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { firebaseAuth, firestore } from '../utils/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';

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
    const user = firebaseAuth.currentUser;

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
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        const detailRef = doc(firestore, 'userDetail', user?.uid);
        const detailSnap = await getDoc(detailRef);
        const userDetail = detailSnap.data();

        setDetail({
          displayName: user.displayName || '',
          bio: userDetail?.bio || '',
          photoURL: user.photoURL || '',
        });

        // reset({
        //   displayName: user.displayName || "",
        //   bio: userDetail?.bio || "",
        //   photoURL: user.photoURL || "",
        // });
      }
    });
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <section className='border-2 rounded-md flex flex-col p-4'>
      <h1 className='font-bold text-xl mb-2'>Edit Profile</h1>

      <form onSubmit={handleSubmit(handleEditProfile)} noValidate>
        <Stack spacing={2}>
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
