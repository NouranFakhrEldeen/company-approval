import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  DeleteDateColumn,
} from 'typeorm';
import { Segment } from '.';

@Entity()
@Unique(['number', 'segmentId', 'owner'])
// @Unique(['name', 'segmentId', 'owner'])
export class SegmentItem {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Segment, segment => segment.items)
  @JoinColumn([{ name: "segmentId", referencedColumnName: "id" }])
  segment?: Segment;

  @Column({ type: 'nvarchar'})
  segmentId: string;

  @Column({ nullable: true, type: 'nvarchar', length: 2000 })
  number: string;

  @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
  name: string;

  // ===============================system data===================================

  @CreateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true, type: 'nvarchar', length: 1000 })
  creator?: string;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt?: Date;

  @Column({type: 'nvarchar', length: 1000})
  owner?: string;

}