import Handlebars from 'handlebars';
import { EmailTemplate } from '../../lib/email';

export const teamInvitationForNewUserTemplate: EmailTemplate = {
  subject: `You've been invited to collaborate`,
  html: Handlebars.compile(`
    <h1>You've been invited !</h1>
    <p>You have been invited you to collaborate on {{teamName}}. Use this link to create your account: <a href="{{setPasswordLink}}">Create account</a></p>
  `),
  text: Handlebars.compile(`
    You've been invited !
    You have been has invited you to collaborate on {{teamName}}. Use this link to create your account: {{setPasswordLink}}
  `),
};
