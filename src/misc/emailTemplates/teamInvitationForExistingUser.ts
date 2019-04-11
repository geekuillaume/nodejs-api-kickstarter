import Handlebars from 'handlebars';
import { EmailTemplate } from '../../lib/email';

export const teamInvitationExistingUserTemplate: EmailTemplate = {
  subject: `You've been invited to collaborate`,
  html: Handlebars.compile(`
    <h1>You've been invited !</h1>
    <p>You have been invited you to collaborate on {{teamName}}. Login to access newly shared resources.</p>
  `),
  text: Handlebars.compile(`
    You've been invited !
    You have been has invited you to collaborate on {{teamName}}. Login to access newly shared resources.
  `),
};
