import { LoginForm1 } from "./components/login-form-1"

export default function SignInPage() {
  return (
    <div className="bg-dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm1 />
      </div>
    </div>
  )
}
