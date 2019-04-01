import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index,
} from 'typeorm';
import { Team } from '../team/teamSchema';
import { SubscriptionPlan } from '../subscriptionPlan/subscriptionPlanSchema';

@Entity({
  schema: 'api_public',
})
export class TeamSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Team)
  team: Team;

  @ManyToOne(() => SubscriptionPlan)
  @Index()
  subscriptionPlan: SubscriptionPlan;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
