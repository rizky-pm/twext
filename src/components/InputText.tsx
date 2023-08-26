import dayjs from 'dayjs';
import { TextField } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { firebaseAuth, firestore } from '../utils/firebase';

type FormValues = {
  content: string;
};

const InputText = () => {
  const { register, formState, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      content: '',
    },
  });
  const { isSubmitting, errors } = formState;

  const handleCreateNewPost = async (data: FormValues) => {
    const timestamp = dayjs().toISOString();
    const currentUserEmail = firebaseAuth.currentUser?.email;
    const currentUserId = firebaseAuth.currentUser?.uid;
    const currentUserDisplayName = firebaseAuth.currentUser?.displayName;

    await setDoc(doc(firestore, 'posts', uuidv4()), {
      ...data,
      author: {
        id: currentUserId,
        email: currentUserEmail,
        displayName: currentUserDisplayName,
      },
      createdAt: timestamp,
    });

    reset();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleCreateNewPost)}
      className='mb-4'
    >
      <TextField
        id='filled-multiline-flexible'
        placeholder="What's on your mind?"
        multiline
        fullWidth
        rows={4}
        {...register('content', {
          required: 'Post content cant be empty',
        })}
        error={!!errors.content}
        helperText={errors.content?.message}
      />

      <button
        type='submit'
        className='mt-2 p-2 text-sm bg-primary text-white rounded w-20 font-bold uppercase'
        disabled={isSubmitting}
      >
        Post
      </button>
    </form>
  );
};

export default InputText;
