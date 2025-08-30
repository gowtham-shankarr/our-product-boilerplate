interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.resend.com";

    if (!this.apiKey) {
      console.warn(
        "EmailService: No API key provided. Emails will not be sent."
      );
    }
  }

  async sendEmail(data: EmailData): Promise<EmailResponse> {
    try {
      if (!this.apiKey) {
        console.warn(
          "EmailService: Skipping email send - no API key configured"
        );
        return {
          success: true,
          messageId: "mock-message-id",
        };
      }

      const response = await fetch(`${this.baseUrl}/emails`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from:
            data.from ||
            process.env.RESEND_FROM_EMAIL ||
            "onboarding@resend.dev",
          to: data.to,
          subject: data.subject,
          html: data.html,
        }),
      });

      const result = (await response.json()) as any;

      if (!response.ok) {
        console.error("Resend API error:", result);
        throw new Error(
          result.message || `Failed to send email: ${response.status}`
        );
      }

      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Email sending error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async sendInvitationEmail(
    to: string,
    organizationName: string,
    inviterName: string,
    role: string,
    invitationUrl: string
  ): Promise<EmailResponse> {
    const subject = `You've been invited to join ${organizationName}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Organization Invitation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Organization Invitation</h2>
            </div>
            
            <p>Hello!</p>
            
            <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> as a <strong>${role}</strong>.</p>
            
            <p>Click the button below to accept the invitation and join the organization:</p>
            
            <a href="${invitationUrl}" class="button">Accept Invitation</a>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${invitationUrl}</p>
            
            <p>This invitation will expire in 7 days.</p>
            
            <div class="footer">
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
              <p>Best regards,<br>The Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }

  async sendEmailVerificationEmail(
    to: string,
    verificationUrl: string,
    userName: string
  ): Promise<EmailResponse> {
    const subject = "Verify Your Email Address";
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Verify Your Email Address</h2>
            </div>
            
            <p>Hello ${userName},</p>
            
            <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
            
            <a href="${verificationUrl}" class="button">Verify Email</a>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${verificationUrl}</p>
            
            <p>This verification link will expire in 24 hours.</p>
            
            <div class="footer">
              <p>Best regards,<br>The Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({ to, subject, html });
  }
}
