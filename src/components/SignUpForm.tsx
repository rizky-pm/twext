import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

import { TextField, Button, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { firebaseAuth } from '../utils/firebase';

type SignUpValues = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const SignUpForm = () => {
  const { register, formState, handleSubmit, getValues } =
    useForm<SignUpValues>({
      defaultValues: {
        email: '',
        password: '',
        passwordConfirm: '',
      },
    });
  const { isSubmitting, errors } = formState;
  const navigate = useNavigate();

  const user = localStorage.getItem('user');

  const handleSignUp = async (data: SignUpValues) => {
    const { email, password } = data;

    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        localStorage.setItem('user', JSON.stringify(userCredential));
        navigate('/');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
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
      onSubmit={handleSubmit(handleSignUp)}
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
        error={!!errors.email}
        helperText={errors.email?.message}
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

      <TextField
        id='passwordConfirm'
        placeholder='Password confirm'
        variant='outlined'
        size='small'
        type='password'
        {...register('passwordConfirm', {
          required: 'Password confirmation is required',
          validate: (value) =>
            value === getValues('password') || 'Password does not match',
        })}
        error={!!errors.passwordConfirm}
        helperText={errors.passwordConfirm?.message}
      />

      <Button type='submit' variant='contained' disabled={isSubmitting}>
        Sign Up
      </Button>

      <Divider />

      <Button
        variant='text'
        onClick={() => {
          navigate('/sign-in');
        }}
      >
        Sign In
      </Button>
    </form>
  );
};

export default SignUpForm;
