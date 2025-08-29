// Email template stubs
export const emailTemplates = {
  welcome: (data: any) => ({ subject: "Welcome", html: "<p>Welcome!</p>" }),
  resetPassword: (data: any) => ({
    subject: "Reset Password",
    html: "<p>Reset your password</p>",
  }),
  verifyEmail: (data: any) => ({
    subject: "Verify Email",
    html: "<p>Verify your email</p>",
  }),
} as const;

// Email service
export { EmailService } from "./email-service";
