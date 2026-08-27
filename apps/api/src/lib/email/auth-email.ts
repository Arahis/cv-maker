import { sendEmail } from "./email.js";

export async function sendVerificationCodeEmail({
  to,
  code,
}: {
  to: string;
  code: string;
}) {
  await sendEmail({
    to,
    subject: "Confirm your Cvoop email",
    html: `
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
    text: `Your verification code is: ${code}. This code expires in 10 minutes.`,
  });
}
