import { TextField, Button, Divider, Container } from '@mui/material';
import SignUpForm from '../components/SignUpForm';

const SignUp = () => {
  return (
    <main className='flex justify-center items-center h-screen'>
      <Container maxWidth='xs' className='border-2 rounded p-4'>
        <h1 className='text-center font-extrabold text-4xl'>twext</h1>
        <SignUpForm />
      </Container>
    </main>
  );
};

export default SignUp;
