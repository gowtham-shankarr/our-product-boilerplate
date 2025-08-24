import { LoginForm } from "@/components/auth";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back to your account
          </p> */}
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
