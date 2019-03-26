import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
} from 'typeorm';
import { User } from '../user/userSchema';
import { Membership } from '../membership/membershipSchema';
import { TeamSubscription } from '../teamSubscription/teamSubscriptionSchema';

@Entity({
  schema: 'api_public',
})
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User)
  owner: User;

  @OneToMany(() => Membership, (membership) => membership.team)
  memberships: Membership[];

  @OneToMany(() => TeamSubscription, (teamSubscription) => teamSubscription.team)
  subscriptions?: TeamSubscription[];
}
