import { dbManager } from '../models/db';
import { User } from '../models/user/userSchema';
import { sendEmail } from '../lib/email';
import { hookTaskInDbTransaction } from '../lib/requestContext';
import { Team } from '../models/team/teamSchema';
import { teamInvitationExistingUserTemplate } from '../misc/emailTemplates/teamInvitationForExistingUser';

interface SendInvitationEmailParams {
  userId: string;
  teamId: string;
}

const sendInvitationEmail = hookTaskInDbTransaction(
  async ({ userId, teamId }: SendInvitationEmailParams) => {
    const user = await dbManager().findOneOrFail(User, userId);
    const team = await dbManager().findOneOrFail(Team, teamId);

    await sendEmail({
      to: user.email,
      template: teamInvitationExistingUserTemplate,
      variables: {
        teamName: team.name,
      },
    });
  },
);

export default sendInvitationEmail;
