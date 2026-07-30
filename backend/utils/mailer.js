import nodemailer from "nodemailer";

const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error(
      "Missing email settings: please configure EMAIL_USER and EMAIL_PASSWORD in backend/.env"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request - Lost & Found",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Lost & Found account.</p>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
      <p>Or paste this link in your browser:</p>
      <p>${resetLink}</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Security tip: Never share your password reset link with anyone.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email, name) => {
  const transporter = getTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Lost & Found",
    html: `
      <h2>Welcome to Lost & Found, ${name}!</h2>
      <p>Your account has been created successfully.</p>
      <p>You can now log in and start reporting lost or found items.</p>
      <p>Happy searching!</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
