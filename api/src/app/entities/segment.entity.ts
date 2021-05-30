import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  Unique,
  DeleteDateColumn,
} from 'typeorm';
import { SegmentItem } from '.';
@Entity()
@Unique(['checklistId', 'owner'])
// @Unique(['name', 'owner'])

export class Segment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'nvarchar'})
  checklistId: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  enabled: boolean;

  @Column({ nullable: true,})
  index: number;

  @OneToMany(() => SegmentItem, segmentItem => segmentItem.segment, { cascade: true, onDelete: 'CASCADE', eager: true })
  items: SegmentItem[]

  // ===============================system data===============================
  @CreateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
  updatedAt: Date;

  @Column({ nullable: true, type: 'nvarchar', length: 1000 })
  creator: string;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  @Column({type: 'nvarchar', length: 1000})
  owner: string;
}