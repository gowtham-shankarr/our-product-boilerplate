import { SignupForm } from "@/components/auth";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground mt-2">
            Create your account to get started
          </p> */}
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
