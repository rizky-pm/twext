import { Container } from '@mui/material';

import LoginHero from '../assets/login-hero.jpg';
import SignInForm from '../components/SignInForm';

const SignIn = () => {
  return (
    <main className='flex justify-center items-center h-screen'>
      <Container maxWidth={'md'}>
        <div className='flex items-center'>
          <div className='w-1/2'>
            <img
              className='w-3/4'
              src={LoginHero}
              alt='Men sitting on stone wall staring at phone'
            />
          </div>
          <div className='w-1/2'>
            <h1 className='font-extrabold text-5xl'>twext</h1>
            <p>Textual Expression, Shared with Ease</p>

            <SignInForm />
          </div>
        </div>
      </Container>
    </main>
  );
};

export default SignIn;
