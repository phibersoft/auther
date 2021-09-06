import { createTransport } from "nodemailer";
import * as jwt from "jsonwebtoken";

require("dotenv").config();

import * as express from "express";
import { db } from "../helpers/db";
import { DB_USERITEM } from "../helpers/interfaces";
import * as bcrypt from "bcrypt";

const transporter = createTransport({
  host: process.env.MAIL_SMTP_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

export const ResetPasswordController_SendMail = async (
  req: express.Request,
  res: express.Response
) => {
  // auth/reset-password/[:email]
  const { email } = req.params;

  // Checking/getting user
  const results = await db.query<DB_USERITEM>(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  if (results.rowCount === 0) {
    throw new Error("No user found.");
  }

  const user = results.rows[0];
  // Generating Link
  const generated = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  // Sending Email
  await transporter.sendMail({
    from: process.env.MAIL_SENDER,
    to: email,
    subject: "Reset Password Request",
    html: `<p>Password reset request has been sent. 
            If you are not the sender, you can ignore this email. 
            If it is you, you can reset your password <a href="${process.env.MAIL_RESET_URI}?token=${generated}"> by clicking this link. </a> 
            </p><strong>This link will be invalid in 30 minutes.</strong>`,
  });

  return res.json({
    email,
  });
};

export default async function ResetPasswordController(
  req: express.Request,
  res: express.Response
) {
  // auth/reset-password
  const body = req.body as Pick<DB_USERITEM, "password" | "email">;
  const encrypted = bcrypt.hashSync(body.password, 10);

  const query = `UPDATE users SET password = $1 WHERE email = $2`;
  const args = [encrypted, body.email];

  const results = await db.query(query, args);

  if (results.rowCount === 0) {
    throw new Error("Nothing updated.");
  }

  return res.json({
    success: true,
  });
}
