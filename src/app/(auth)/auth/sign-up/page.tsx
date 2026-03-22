import { SignupForm1 } from './components/signup-form-1';

export default function SignUpPage() {
  return (
    <div className='bg-dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='flex w-full max-w-md flex-col gap-6'>
        <SignupForm1 />
      </div>
    </div>
  );
}
