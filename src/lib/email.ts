import * as nodemailer from 'nodemailer';
import * as config from 'config';
import log from './log';

const transport = nodemailer.createTransport(config.get('email.smtp'));

export interface EmailTemplate {
  subject: HandlebarsTemplateDelegate | string;
  html: HandlebarsTemplateDelegate | string;
  text: HandlebarsTemplateDelegate | string;
}

interface SendEmailParams {
  to: string;
  template: EmailTemplate;
  variables: object;
}
// You can use Handlebars templates with this method for either subject, html or text fields
export const sendEmail = async ({ to, template, variables }: SendEmailParams) => {
  const compiledEmail = {
    subject: typeof template.subject === 'function' ? template.subject(variables) : template.subject,
    html: typeof template.html === 'function' ? template.html(variables) : template.html,
    text: typeof template.text === 'function' ? template.text(variables) : template.text,
  };
  const info = await transport.sendMail({
    to,
    from: config.get('email.from'),
    subject: compiledEmail.subject,
    text: compiledEmail.text,
    html: compiledEmail.html,
  });
  if (config.get('email.testServer')) {
    log.info(`Sent email to ${to}, preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
};
