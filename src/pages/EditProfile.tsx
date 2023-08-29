import { useEffect, useState, useRef } from 'react';
import { Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import {
  getDownloadURL,
  ref,
  // uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';

import { firestore, firebaseStorage } from '../utils/firebase';
import useAuthStore from '../state/auth/authStore';

import UpladAvatarIcon from '../assets/UploadAvatarIcon';

type EditProfileValues = {
  displayName: string;
  bio: string;
  photoURL: string;
};

type AvatarFile = {
  bytes: File | null;
  url: string | null;
};

type HeaderFile = {
  bytes: File | null;
  url: string | null;
};

const EditProfile = () => {
  const [detail, setDetail] = useState<EditProfileValues>({
    displayName: '',
    bio: '',
    photoURL: '',
  });
  const [isAvatarTooltipOpen, setIsAvatarTooltipOpen] =
    useState<boolean>(false);
  const [avatarFile, setAvatarFile] = useState<AvatarFile>({
    bytes: null,
    url: null,
  });
  const [headerFile, setHeaderFile] = useState<HeaderFile>({
    bytes: null,
    url: null,
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

    if (avatarFile.bytes) {
      const avatarStorageRef = ref(firebaseStorage, `${user.uid}/` + 'avatar');
      const avatarUploadTask = uploadBytesResumable(
        avatarStorageRef,
        avatarFile.bytes
      );

      promises.push(
        new Promise<void>((resolve, reject) => {
          avatarUploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = snapshot.bytesTransferred / snapshot.totalBytes;
              console.log('Avatar upload task', progress);
              // setUploadProgress(progress);
            },
            (error) => {
              console.log('Avatar upload error : ', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(avatarStorageRef);
              console.log(
                'Avatar uploaded successfully. Download URL:',
                downloadURL
              );
              resolve();
            }
          );
        })
      );
    }

    if (headerFile.bytes) {
      const headerStorageRef = ref(firebaseStorage, `${user.uid}/` + 'header');
      const headerUploadTask = uploadBytesResumable(
        headerStorageRef,
        headerFile.bytes
      );

      promises.push(
        new Promise<void>((resolve, reject) => {
          headerUploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = snapshot.bytesTransferred / snapshot.totalBytes;
              console.log('Header upload task', progress);
              // setUploadProgress(progress);
            },
            (error) => {
              console.log('Header upload error : ', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(headerStorageRef);
              console.log(
                'Avatar uploaded successfully. Download URL:',
                downloadURL
              );
              resolve();
            }
          );
        })
      );

      await headerUploadTask;
    }
  };

  console.log(uploadProgress);

  const getUserDetail = async () => {
    if (user) {
      const detailRef = doc(firestore, 'userDetail', user?.uid);
      const detailSnap = await getDoc(detailRef);
      const userDetail = detailSnap.data();
      const avatarRef = ref(firebaseStorage, `${user.uid}/avatar`);
      const headerRef = ref(firebaseStorage, `${user.uid}/header`);

      if (avatarRef) {
        getDownloadURL(avatarRef)
          .then((url) => {
            setAvatarFile((prevState) => ({ ...prevState, url: url }));
          })
          .catch((e) => {
            console.log(e);
          });
      }

      if (headerRef) {
        getDownloadURL(headerRef)
          .then((url) => {
            setHeaderFile((prevState) => ({ ...prevState, url: url }));
          })
          .catch((e) => {
            console.log(e);
          });
      }

      setDetail({
        displayName: user.displayName || '',
        bio: userDetail?.bio || '',
        photoURL: user.photoURL || '',
      });
    }
  };

  const inputAvatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const temporaryUrl = URL.createObjectURL(selectedFile);
      setAvatarFile({ bytes: selectedFile, url: temporaryUrl });
    }
  };

  const inputHeaderHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const temporaryUrl = URL.createObjectURL(selectedFile);
      setHeaderFile({ bytes: selectedFile, url: temporaryUrl });
    }
  };

  useEffect(() => {
    getUserDetail();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsAvatarTooltipOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <section className='border-2 rounded-md flex flex-col p-4'>
      <h1 className='font-bold text-xl mb-2'>Edit Profile</h1>

      <form
        onSubmit={handleSubmit(handleEditProfile)}
        noValidate
        className='flex flex-col space-y-2'
      >
        <div className='flex flex-col'>
          {/* HEADER SECTION */}
          <div className='flex h-56 relative rounded overflow-hidden '>
            <div
              className='flex absolute top-0 left-0 justify-center items-center w-full h-full bg-neutral-900 bg-opacity-50 hover:bg-opacity-70 transition cursor-pointer'
              onClick={() => {
                if (inputHeaderRef) {
                  inputHeaderRef.current?.click();
                }
              }}
            >
              <UpladAvatarIcon
                className='stroke-white w-10 h-10'
                fill='fill-white'
              />
            </div>

            {headerFile.url ? (
              <img
                loading='lazy'
                src={headerFile.url}
                alt='space'
                className='w-full h-full object-cover bg-bottom rounded'
              />
            ) : (
              <div className='bg-slate-800 w-full h-full'></div>
            )}
          </div>

          {/* AVATAR SECTION */}
          <div className='relative self-start -mt-14 ml-4'>
            <button
              type='button'
              className='rounded-full cursor-pointer w-28 h-28 fill-transparent overflow-hidden relative'
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                setIsAvatarTooltipOpen(true);
              }}
            >
              {avatarFile.url ? (
                <img
                  loading='lazy'
                  src={avatarFile.url}
                  alt='Policeman'
                  className='object-cover w-full h-full'
                />
              ) : (
                <div className='w-full h-full rounded-full bg-slate-900'></div>
              )}

              <span className='absolute top-0 left-0 bg-opacity-50 transition bg-neutral-800 hover:bg-neutral-950 hover:bg-opacity-50 w-full h-full flex justify-center items-center'>
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

            <input
              ref={inputHeaderRef}
              type='file'
              name='header'
              id='header'
              className='hidden'
              onChange={(e) => {
                inputHeaderHandler(e);
              }}
            />
          </div>
        </div>

        <div className='flex flex-col space-y-4'>
          <label htmlFor='displayName' className='font-semibold'>
            Display Name
            <TextField
              id='displayName'
              placeholder={detail.displayName || 'Display Name'}
              variant='outlined'
              size='small'
              type='text'
              fullWidth
              {...register('displayName')}
            />
          </label>

          <label htmlFor='bio' className='font-semibold'>
            Bio
            <TextField
              id='bio'
              placeholder={detail.bio || 'Write interesting bio'}
              multiline
              fullWidth
              rows={6}
              {...register('bio')}
              error={!!errors.bio}
              helperText={errors.bio?.message}
            />
          </label>

          <button
            disabled={isSubmitting}
            className='primary-button'
            type='submit'
          >
            Edit
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProfile;
