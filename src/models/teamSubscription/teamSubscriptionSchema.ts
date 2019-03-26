import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
} from 'typeorm';
import { Team } from '../team/teamSchema';
import { SubscriptionPlan } from '../subscriptionPlan/subscriptionPlanSchema';

@Entity({
  schema: 'api_public',
})
export class TeamSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team)
  team: Team;

  @ManyToOne(() => SubscriptionPlan)
  subscriptionPlan: SubscriptionPlan;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
