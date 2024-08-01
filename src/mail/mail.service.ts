import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendPasswordResetEmail(id: number, email: string, token: string) {
    const resetPasswordLink = `${this.configService.get<string>('CLIENT_URL')}/auth/reset-password/${id}/${token}`;

    const mailInfo = {
      to: email,
      subject: 'Reset Password Link ✔',
      text: `Hello! We've received a password reset request. Please follow the given link to reset your password\n\n
      ${resetPasswordLink}\n
      This password link will be valid only 20 minutes.\n\n
           Thanks`,
    };

    await this.mailerService.sendMail(mailInfo);
  }

  async changeEmailNotification(username: string, email: string) {
    const mailInfo = {
      to: `${email}`,
      subject: 'Email Verification ✔',
      text: `Hello ${username}! There, You have recently
           changed your email.
           Thank you!`,
    };

    await this.mailerService.sendMail(mailInfo);
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

    await this.mailerService.sendMail(mailInfo);
  }
}
