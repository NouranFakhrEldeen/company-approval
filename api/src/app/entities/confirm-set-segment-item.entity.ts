import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ConfirmSetSegment } from '.';
import { AnswerItemSegmentEnum } from '../enums';

@Entity()
@Unique(['owner', 'confirmSetSegmentId', 'number'])

export class ConfirmSetSegmentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ConfirmSetSegment, confirmSetSegment => confirmSetSegment.items)
  @JoinColumn([{ name: "confirmSetSegmentId", referencedColumnName: "id" }])
  confirmSetSegment: ConfirmSetSegment;

  @Column({ nullable: true, type: 'nvarchar'})
  confirmSetSegmentId: string;

  @Column({ nullable: true, type: 'nvarchar', length: 2000 })
  number: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  name: string;

  @Column({ nullable: true })
  answer: AnswerItemSegmentEnum;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  description: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  comment: string;

  // ===============================system data===================================

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