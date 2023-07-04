import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { ConfigService } from '../../core/config/config.service';

@Injectable()
export class SendEmailMiddleware {
    constructor(private mailerService: MailerService, private configService: ConfigService) { }

    sendEmail(email: string, token: string, attachmentsArray) {

        // in the case that we will communicate with front-end app 
        // let link = `http://${this.configService.get('WEB_APP_URI')}/#/account?tokenVerifyEmail=${token}`;

        // in this case that will return verifyEmail to true
        let link = `http://${this.configService.get('WEB_APP_URI')}/auth/verify/${token}`;
        let subjectObject = {
            subjectTitle: 'E-mail de confirmation compte "API"',
            subjectBody: `Bonjour ,<br> Votre compte associé à l'adresse email '${email}' demande une vérification.<br>
       Pour compléter le processus de vérification de votre compte merci de cliquer sur ce lien:  ${link} <br>`,
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