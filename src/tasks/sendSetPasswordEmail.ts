import config from 'config';

import { DateTime } from 'luxon';
import { dbManager } from '../models/db';
import { User } from '../models/user/userSchema';
import { sendEmail } from '../lib/email';
import { accountActivationTemplate } from '../misc/emailTemplates/accountActivation';
import { ResetPasswordToken } from '../models/resetPasswordToken/resetPasswordTokenSchema';
import { generateToken } from '../lib/helpers';
import { hookTaskInDbTransaction } from '../lib/requestContext';
import { Team } from '../models/team/teamSchema';
import { teamInvitationForNewUserTemplate } from '../misc/emailTemplates/teamInvitationForNewUser';
import { resetPasswordTemplate } from '../misc/emailTemplates/resetPassword';

export enum SetPasswordEmailType {
  ACCOUNT_ACTIVATION = 'ACCOUNT_ACTIVATION',
  TEAM_INVITATION_FOR_NEW_USER = 'TEAM_INVITATION_FOR_NEW_USER',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

interface SendSetPasswordEmailParams {
  type: SetPasswordEmailType;
  userId: string;
  teamInviteId?: string;
}

const sendSetPasswordEmail = hookTaskInDbTransaction(
  async ({ type, userId, teamInviteId }: SendSetPasswordEmailParams) => {
    const user = await dbManager().findOneOrFail(User, userId);

    await dbManager().delete(ResetPasswordToken, { userId });
    const token = dbManager().create(ResetPasswordToken, {
      userId,
      expireAt: DateTime.local().plus(type === SetPasswordEmailType.RESET_PASSWORD
        ? { hours: 6 }
        : { years: 1 }),
      token: await generateToken(),
    });
    await dbManager().save(token);

    const setPasswordLink = new URL('/setPassword', config.get('webappUrl'));
    setPasswordLink.searchParams.set('token', token.token);
    setPasswordLink.searchParams.set('type', type);

    if (type === SetPasswordEmailType.TEAM_INVITATION_FOR_NEW_USER) {
      const team = await dbManager().findOneOrFail(Team, teamInviteId);
      setPasswordLink.searchParams.set('teamName', team.name);
      await sendEmail({
        to: user.email,
        template: teamInvitationForNewUserTemplate,
        variables: {
          setPasswordLink: setPasswordLink.toString(),
          teamName: team.name,
        },
      });
    } else if (type === SetPasswordEmailType.ACCOUNT_ACTIVATION) {
      await sendEmail({
        to: user.email,
        template: accountActivationTemplate,
        variables: {
          setPasswordLink: setPasswordLink.toString(),
        },
      });
    } else if (type === SetPasswordEmailType.RESET_PASSWORD) {
      await sendEmail({
        to: user.email,
        template: resetPasswordTemplate,
        variables: {
          setPasswordLink: setPasswordLink.toString(),
        },
      });
    }
  },
);

export default sendSetPasswordEmail;
