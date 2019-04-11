import config from 'config';

import { DateTime } from 'luxon';
import { dbManager, commitTransaction } from '../models/db';
import { User } from '../models/user/userSchema';
import { sendEmail } from '../lib/email';
import { accountActivationTemplate } from '../misc/emailTemplates/accountActivation';
import { ResetPasswordToken } from '../models/resetPasswordToken/resetPasswordTokenSchema';
import { generateToken } from '../lib/helpers';
import { hookTaskInDbTransaction } from '../lib/requestContext';
import { Team } from '../models/team/teamSchema';
import { teamInvitationForNewUserTemplate } from '../misc/emailTemplates/teamInvitationForNewUser';

interface SendActivateAccountEmailParams {
  userId: string;
  teamInviteId?: string;
}

const sendActivateAccountEmail = hookTaskInDbTransaction(
  async ({ userId, teamInviteId }: SendActivateAccountEmailParams) => {
    const user = await dbManager().findOneOrFail(User, userId);

    await dbManager().delete(ResetPasswordToken, { userId });
    const token = dbManager().create(ResetPasswordToken, {
      userId,
      expireAt: DateTime.local().plus({ years: 10 }),
      token: await generateToken(),
    });
    await dbManager().save(token);

    const activationLink = new URL('/activate', config.get('webappUrl'));
    activationLink.searchParams.set('token', token.token);

    if (teamInviteId) {
      const team = await dbManager().findOneOrFail(Team, teamInviteId);
      activationLink.searchParams.set('teamName', team.name);
      await sendEmail({
        to: user.email,
        template: teamInvitationForNewUserTemplate,
        variables: {
          invitationLink: activationLink.toString(),
          teamName: team.name,
        },
      });
    } else {
      await sendEmail({
        to: user.email,
        template: accountActivationTemplate,
        variables: {
          activationLink: activationLink.toString(),
        },
      });
    }

    await commitTransaction();
  },
);

export default sendActivateAccountEmail;
