import Handlebars from 'handlebars';
import { EmailTemplate } from '../../lib/email';

export const resetPasswordTemplate: EmailTemplate = {
  subject: `Reset your password`,
  html: Handlebars.compile(`
    <p>Use this link to reset your password: <a href="{{setPasswordLink}}">Reset password</a>. It will expire in 6 hours.</p>
  `),
  text: Handlebars.compile(`
    Use this link to reset your password: {{setPasswordLink}}. It will expire in 6 hours.
  `),
};
