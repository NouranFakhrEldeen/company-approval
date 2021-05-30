import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
  DeleteDateColumn,
} from 'typeorm';
import { ConfirmSet, ConfirmSetSegmentItem, Deviation } from '.';
import { SegmentStatusEnum } from '../enums';
@Entity()
// @Unique(['confirmSetId', 'checklistId', 'room', 'owner'])
// @Unique(['confirmSetId', 'segmentId', 'room', 'owner'])

export class ConfirmSetSegment {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => ConfirmSet, confirmSet => confirmSet.segments)
  @JoinColumn([{ name: "confirmSetId", referencedColumnName: "id" }])
  confirmSet?: ConfirmSet;

  @Column({type: 'nvarchar'})
  confirmSetId: string;

  @Column({type: 'nvarchar'})
  segmentId: string;

  @Column()
  checklistId: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  name: string;

  @Column({ nullable: true, default: SegmentStatusEnum.PENDING })
  status: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true, type: 'nvarchar', length: 4000 })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  street: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  addressAlias: string; 

  @Column({ nullable: true, type: 'nvarchar', length: 4000 })
  room: string;

  @OneToMany(() => ConfirmSetSegmentItem, confirmSetSegmentItem => confirmSetSegmentItem.confirmSetSegment, { cascade: true, onDelete: 'CASCADE' })
  items: ConfirmSetSegmentItem[]

  @Column({ nullable: true })
  hasCertificate?: boolean;

  @OneToMany(() => Deviation, deviation => deviation.confirmSetSegment, { cascade: true, onDelete: 'CASCADE' })
  deviations?: Deviation[]

  @Column({ nullable: true })
  approvedTime?: Date;

  @Column({ nullable: true })
  declinedTime?: Date;

  @Column({ nullable: true })
  auditedTime?: Date;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  feedback: string;

  // ===============================system data===================================

  @CreateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true, type: 'nvarchar', length: 1000 })
  creator: string;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt?: Date;

  @Column({type: 'nvarchar', length: 1000})
  owner: string;

}