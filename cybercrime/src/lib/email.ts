import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Email templates
export const emailTemplates = {
  caseAssigned: (caseName: string, caseId: string, assignedBy: string) => ({
    subject: `New Case Assigned: ${caseId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
          <h2 style="color: #007bff; margin-top: 0;">New Case Assignment</h2>
          <p>You have been assigned to a new cyber crime case:</p>

          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <strong>Case ID:</strong> ${caseId}<br>
            <strong>Case Title:</strong> ${caseName}<br>
            <strong>Assigned by:</strong> ${assignedBy}
          </div>

          <p>Please log in to the Cyber Crime Monitoring System to review the case details.</p>

          <a href="${process.env.APP_URL}/cases/${caseId}"
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0;">
            View Case Details
          </a>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Royal Papua New Guinea Police Force<br>
            Cyber Crime Monitoring System
          </p>
        </div>
      </div>
    `,
    text: `
      New Case Assignment

      You have been assigned to a new cyber crime case:

      Case ID: ${caseId}
      Case Title: ${caseName}
      Assigned by: ${assignedBy}

      Please log in to the Cyber Crime Monitoring System to review the case details.

      ${process.env.APP_URL}/cases/${caseId}

      Royal Papua New Guinea Police Force
      Cyber Crime Monitoring System
    `,
  }),

  urgentAlert: (message: string, caseId?: string) => ({
    subject: `🚨 URGENT ALERT - Cyber Crime Unit`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
          <h2 style="color: #dc3545; margin-top: 0;">🚨 URGENT ALERT</h2>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0; border: 1px solid #dc3545;">
            <p style="margin: 0; font-size: 16px;">${message}</p>
            ${caseId ? `<p style="margin: 10px 0 0 0;"><strong>Related Case:</strong> ${caseId}</p>` : ''}
          </div>

          <p style="color: #721c24;">This alert requires immediate attention. Please log in to the system immediately.</p>

          <a href="${process.env.APP_URL}/dashboard"
             style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0;">
            Access System Now
          </a>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Royal Papua New Guinea Police Force<br>
            Cyber Crime Monitoring System
          </p>
        </div>
      </div>
    `,
    text: `
      🚨 URGENT ALERT - Cyber Crime Unit

      ${message}
      ${caseId ? `Related Case: ${caseId}` : ''}

      This alert requires immediate attention. Please log in to the system immediately.

      ${process.env.APP_URL}/dashboard

      Royal Papua New Guinea Police Force
      Cyber Crime Monitoring System
    `,
  }),

  evidenceUploaded: (caseName: string, caseId: string, evidenceTitle: string, uploadedBy: string) => ({
    subject: `New Evidence: ${caseId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
          <h2 style="color: #28a745; margin-top: 0;">New Evidence Added</h2>
          <p>New evidence has been uploaded to one of your cases:</p>

          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <strong>Case ID:</strong> ${caseId}<br>
            <strong>Case Title:</strong> ${caseName}<br>
            <strong>Evidence:</strong> ${evidenceTitle}<br>
            <strong>Uploaded by:</strong> ${uploadedBy}
          </div>

          <a href="${process.env.APP_URL}/cases/${caseId}#evidence"
             style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0;">
            Review Evidence
          </a>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Royal Papua New Guinea Police Force<br>
            Cyber Crime Monitoring System
          </p>
        </div>
      </div>
    `,
    text: `
      New Evidence Added

      New evidence has been uploaded to one of your cases:

      Case ID: ${caseId}
      Case Title: ${caseName}
      Evidence: ${evidenceTitle}
      Uploaded by: ${uploadedBy}

      ${process.env.APP_URL}/cases/${caseId}#evidence

      Royal Papua New Guinea Police Force
      Cyber Crime Monitoring System
    `,
  }),

  passwordReset: (userName: string, resetUrl: string) => ({
    subject: `Password Reset Request - PNG Police Cyber Crime System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #856404;">
          <h2 style="color: #856404; margin-top: 0;">🔐 Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password for the PNG Police Cyber Crime Monitoring System.</p>

          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #ffeaa7;">
            <p style="margin: 0; color: #2d3436;"><strong>If you requested this reset:</strong> Click the button below to create a new password.</p>
            <p style="margin: 10px 0 0 0; color: #2d3436;"><strong>If you didn't request this:</strong> You can safely ignore this email. Your password will not be changed.</p>
          </div>

          <a href="${resetUrl}"
             style="background-color: #856404; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 15px 0; font-weight: bold;">
            Reset My Password
          </a>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              <strong>Security Notice:</strong><br>
              • This link will expire in 1 hour<br>
              • Only use this link if you requested the password reset<br>
              • Never share this link with anyone<br>
              • If you have concerns, contact your system administrator
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Royal Papua New Guinea Police Force<br>
            Cyber Crime Monitoring System<br>
            <br>
            This is an automated security message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Reset Request - PNG Police Cyber Crime System

      Hello ${userName},

      We received a request to reset your password for the PNG Police Cyber Crime Monitoring System.

      If you requested this reset, click the link below to create a new password:
      ${resetUrl}

      If you didn't request this, you can safely ignore this email. Your password will not be changed.

      Security Notice:
      • This link will expire in 1 hour
      • Only use this link if you requested the password reset
      • Never share this link with anyone
      • If you have concerns, contact your system administrator

      Royal Papua New Guinea Police Force
      Cyber Crime Monitoring System

      This is an automated security message. Please do not reply to this email.
    `,
  }),

  passwordResetConfirmation: (userName: string) => ({
    subject: `Password Successfully Reset - PNG Police Cyber Crime System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
          <h2 style="color: #28a745; margin-top: 0;">✅ Password Successfully Reset</h2>
          <p>Hello ${userName},</p>
          <p>Your password for the PNG Police Cyber Crime Monitoring System has been successfully reset.</p>

          <div style="background-color: white; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #c3e6cb;">
            <p style="margin: 0; color: #155724;">
              <strong>Password Reset Confirmed</strong><br>
              Your account is now secured with your new password. You can now log in using your email and new password.
            </p>
          </div>

          <a href="${process.env.NEXTAUTH_URL}/auth/signin"
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 15px 0; font-weight: bold;">
            Sign In Now
          </a>

          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              <strong>Security Reminder:</strong><br>
              • Keep your password secure and don't share it with anyone<br>
              • Use a strong, unique password for your account<br>
              • Log out when finished using the system<br>
              • Report any suspicious activity to your supervisor
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Royal Papua New Guinea Police Force<br>
            Cyber Crime Monitoring System<br>
            <br>
            If you did not reset your password, please contact your system administrator immediately.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Successfully Reset - PNG Police Cyber Crime System

      Hello ${userName},

      Your password for the PNG Police Cyber Crime Monitoring System has been successfully reset.

      Your account is now secured with your new password. You can now log in using your email and new password.

      Sign in: ${process.env.NEXTAUTH_URL}/auth/signin

      Security Reminder:
      • Keep your password secure and don't share it with anyone
      • Use a strong, unique password for your account
      • Log out when finished using the system
      • Report any suspicious activity to your supervisor

      Royal Papua New Guinea Police Force
      Cyber Crime Monitoring System

      If you did not reset your password, please contact your system administrator immediately.
    `,
  }),
};
