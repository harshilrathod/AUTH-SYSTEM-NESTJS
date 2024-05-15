import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 587,
            secureConnection: false, 
            auth: {
                user: process.env.EMAIL_HOST,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                ciphers:'SSLv3'
            }
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        console.log(process.env.EMAIL_HOST);
        
        const mailOptions = {
            from: process.env.EMAIL_HOST,
            to,
            subject,
            text,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
