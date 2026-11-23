import nodemailer from "nodemailer";

export function getEmailTransport() {
  const user = process.env.NODEMAILER_USER?.trim();
  const password = process.env.NODEMAILER_PASSWORD;

  if (!user || !password) {
    return null;
  }

  return {
    user,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: password },
    }),
  };
}
