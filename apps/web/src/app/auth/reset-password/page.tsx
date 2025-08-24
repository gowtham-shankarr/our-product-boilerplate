import { ResetPasswordForm } from "@/components/auth";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your new password below
          </p> */}
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
