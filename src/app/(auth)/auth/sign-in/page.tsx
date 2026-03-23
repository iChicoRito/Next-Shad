import { Suspense } from 'react';
import { LoginForm1 } from './components/signin-form';

// SignInPage - login page with suspense
export default function SignInPage() {
  return (
    <div className="bg-dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm1 />
        </Suspense>
      </div>
    </div>
  );
}
