import { sendEmail } from "./email.js";

function getAppUrl() {
  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    throw new Error("APP_URL is not defined");
  }

  return appUrl;
}

export async function sendEmailVerificationEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}) {
  const verificationUrl = `${getAppUrl()}/verify-email?token=${token}`;

  await sendEmail({
    to,
    subject: "Confirm your Cvoop account",
    html: `
      <p>Welcome to Cvoop!</p>
      <p>Please confirm your email address:</p>
      <p><a href="${verificationUrl}">Confirm email</a></p>
      <p>This link expires in 24 hours.</p>
    `,
    text: `Confirm your Cvoop account: ${verificationUrl}`,
  });
}
