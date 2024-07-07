import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'glen.mertz@ethereal.email',
        pass: 'DwxzZ6zycGsRGj7QBV',
      },
    });
  }

  async sendPasswordResetEmail(id: number, email: string, token: string) {
    const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password/${id}/${token}`;
    const mailInfo = {
      to: email,
      subject: 'Reset Password Link ✔',
      text: `Hello! We've received a password reset request. Please follow the given link to reset your password\n\n
      ${resetPasswordLink}\n
      This password link will be valid only 20 minutes.\n\n
           Thanks`,
    };

    await this.transporter.sendMail(mailInfo);
  }

  async changeEmailNotification(username: string, email: string) {
    const mailInfo = {
      to: `${email}`,
      subject: 'Email Verification ✔',
      text: `Hello ${username}! There, You have recently
           changed your email.
           Thank you!`,
    };

    await this.transporter.sendMail(mailInfo);
  }

  async createUserNotification(username: string, email: string) {
    const mailInfo = {
      to: `${email}`,
      subject: 'Email Verification ✔',
      text: `Hello ${username}! There, You have recently
           visited our website and entered your email. 
           Please follow the given link to verify your email 
           http://localhost:5173/ 
           Thanks`,
    };

    await this.transporter.sendMail(mailInfo);
  }
}
