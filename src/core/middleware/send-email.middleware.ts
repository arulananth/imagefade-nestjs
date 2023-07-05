import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { ConfigService } from '../../core/config/config.service';

@Injectable()
export class SendEmailMiddleware {
    constructor(private mailerService: MailerService, private configService: ConfigService) { }

    sendEmail(email: string, subject: string, html: string, attachmentsArray) {

        
        let subjectObject = {
            subjectTitle: subject,
            subjectBody: html,
        };
        try {
            let mailOptions = {
                to: email,
                subject: subjectObject.subjectTitle,
                html: subjectObject.subjectBody,
                attachments: attachmentsArray,
            };
            this.mailerService.sendMail(mailOptions)
                .then((info) => {
                    console.log('email sent', info)
                });
        } catch (error) {
            console.log('error', error);
        }
    }
}