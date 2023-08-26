import { useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { Navigate } from 'react-router-dom';
import { TextField, Button, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { firebaseAuth } from '../utils/firebase';

type SignInValues = {
  email: string;
  password: string;
};

const SignInForm = () => {
  const { register, formState, handleSubmit } = useForm<SignInValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { isSubmitting, errors } = formState;
  const navigate = useNavigate();

  const handleSignIn = async (data: SignInValues) => {
    const { email, password } = data;

    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        localStorage.setItem('user', JSON.stringify(userCredential));
        navigate('/');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const user = localStorage.getItem('user');

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      console.log(user);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
  }, []);

  if (user) {
    return <Navigate to={'/'} />;
  }

  return (
    <form
      onSubmit={handleSubmit(handleSignIn)}
      className='flex flex-col space-y-4 mt-4'
      noValidate
    >
      <TextField
        id='email'
        placeholder='Email address'
        variant='outlined'
        size='small'
        type='email'
        {...register('email', {
          required: 'Email is required',

          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Invalid email address',
          },
        })}
      />

      <TextField
        id='password'
        placeholder='Password'
        variant='outlined'
        size='small'
        type='password'
        {...register('password', {
          required: 'Password is required',
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button type='submit' variant='contained' disabled={isSubmitting}>
        Sign In
      </Button>

      <Divider />

      <Button
        type='submit'
        variant='outlined'
        onClick={() => {
          navigate('/sign-up');
        }}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignInForm;
