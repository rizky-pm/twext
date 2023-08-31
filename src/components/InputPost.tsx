import dayjs from 'dayjs';
import { TextField } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { firestore } from '../utils/firebase';
import useAuthStore from '../state/auth/authStore';

type FormValues = {
  content: string;
};

const InputPost = () => {
  const { register, formState, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      content: '',
    },
  });
  const { isSubmitting, errors } = formState;
  const { user } = useAuthStore();

  const handleCreateNewPost = async (data: FormValues) => {
    const timestamp = dayjs().toISOString();
    const currentUserEmail = user?.email;
    const currentUserId = user?.uid;
    const currentUserDisplayName = user?.displayName;

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
        id='content'
        placeholder="What's on your mind?"
        multiline
        fullWidth
        rows={4}
        {...register('content', {
          required: 'Post cant be empty',
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

export default InputPost;
