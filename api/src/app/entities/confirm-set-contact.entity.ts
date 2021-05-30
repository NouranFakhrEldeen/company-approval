import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ConfirmSet } from '.';
@Entity()
export class ConfirmSetContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ConfirmSet, confirmSet => confirmSet.contacts)
  @JoinColumn([{ name: "confirmSetId", referencedColumnName: "id" }])
  confirmSet: ConfirmSet;

  @Column()
  confirmSetId: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true, type: 'nvarchar', length: 2000 })
  name: string;

  @Column({ nullable: true, type: 'nvarchar', length: 1000 })
  email: string;

  @Column({ nullable: true })
  phone: string;

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