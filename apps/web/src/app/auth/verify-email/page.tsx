import { VerifyEmailForm } from "@/components/auth";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* <h1 className="text-2xl font-bold">Verify Email</h1>
          <p className="text-muted-foreground mt-2">
            Check your email for a verification code
          </p> */}
        </div>
        <VerifyEmailForm />
      </div>
    </div>
  );
}
