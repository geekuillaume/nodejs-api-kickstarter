import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

export enum Currency {
  EUR = 'eur',
  USD = 'usd',
}

@Entity({
  schema: 'api_public',
})
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  currency: Currency;

  @Column({
    nullable: true,
    unique: true,
  })
  stripePlanId?: string;

  @Column()
  public: boolean;

  @Column()
  durationInDays: number;

  @Column()
  cost: number;
}
