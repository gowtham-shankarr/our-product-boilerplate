import { cn } from "@/lib/utils";
import { Button } from "@acmecorp/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acmecorp/ui";
import { Input } from "@acmecorp/ui";
import { Label } from "@acmecorp/ui";

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a verification code to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Verify Email
              </Button>
              <div className="text-center text-sm">
                Didn't receive the code?{" "}
                <a href="#" className="underline underline-offset-4">
                  Resend
                </a>
              </div>
              <div className="text-center text-sm">
                <a href="/auth/signin" className="underline underline-offset-4">
                  Back to sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
