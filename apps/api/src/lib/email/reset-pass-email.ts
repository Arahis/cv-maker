import { sendEmail } from "./email.js";

export async function sendPasswordResetEmailCode({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  await sendEmail({
    to,
    subject: "Reset your Cvoop password",
    html: `
      <p>Your password reset code is:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
    text: `Your password reset code is: ${code}. This code expires in 10 minutes.`,
  });
}
