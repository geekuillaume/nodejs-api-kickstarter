import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index,
} from 'typeorm';
import { User } from '../user/userSchema';
import { Team } from '../team/teamSchema';

@Entity({
  schema: 'api_public',
})
@Index((t) => [t.user, t.team], { unique: true })
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => User, (user) => user.memberships)
  user: User;

  @Index()
  @ManyToOne(() => Team, (team) => team.memberships)
  team?: Team;

  @Column({
    default: () => 'NOW()',
  })
  createdAt?: Date;

  @Column({
    default: () => 'api_public.current_user_id()',
  })
  invitedById?: string;

  @ManyToOne(() => User)
  invitedBy: User;
}
