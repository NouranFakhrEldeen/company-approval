import { Injectable } from '@nestjs/common';
let nodemailer = require ('nodemailer')

@Injectable()
export class NodeMailerService {
  public client: any;
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send(email: any): Promise<any> {
    let to = email.recipients.filter((item) => item.type === 'NORMAL')
    .map((item) => process.env.SMTP_SECURE === 'true' ? item.email + '.s' : item.email).toString();
    const cc = email.recipients.filter((item) => item.type === 'CC')
    .map((item) => process.env.SMTP_SECURE === 'true' ? item.email + '.s' : item.email).toString();
    const bcc = email.recipients.filter((item) => item.type === 'BCC')
    .map((item) => process.env.SMTP_SECURE === 'true' ? item.email + '.s' : item.email).toString();
    if(process.env.DEBUG_MODE === 'true'){
      to = process.env.DEBUG_EMAIL_RECIPIENT
    }
    try {
      return await this.transporter.sendMail({
        from: `${process.env.SMTP_NAME} <${process.env.SMTP_FROM}>`,
        to, cc, bcc,
        subject: email.subject,
        text: email.body,
        attachments: email.attachments && email.attachments.map((item) => {
          return {
            filename: item.name,
            content: item.content.data,
            encoding: 'base64',
            contentType: item.content.type,
          };
        }),
      });
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
      return;
    }
  }

}
