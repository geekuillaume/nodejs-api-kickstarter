import * as Handlebars from 'handlebars';
import { EmailTemplate } from '../../lib/email';

export const accountActivationTemplate: EmailTemplate = {
  subject: 'Activate your account',
  html: Handlebars.compile(`
    <h1>Welcome to our service !</h1>
    <p>Please click this link to activate your account: <a href="{{activationLink}}">Activate</a></p>
  `),
  text: Handlebars.compile(`
    Welcome to our service !
    Please go to this address to activate your account: {{activationLink}}
  `),
};
