import { Suspense } from 'react';
import { SignupForm1 } from './components/signup-form';

// SignUpPage - registration page with suspense
export default function SignUpPage() {
  return (
    <div className="bg-dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          <SignupForm1 />
        </Suspense>
      </div>
    </div>
  );
}