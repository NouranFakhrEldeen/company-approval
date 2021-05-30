import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Company, ConfirmSetSegment } from '.';
import { ConfirmSetContact } from './confirm-set-contact.entity';
@Entity()
export class ConfirmSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, company => company.confirmSets)
  @JoinColumn([{ name: "companyId", referencedColumnName: "id" }])
  company: Company;

  @Column()
  companyId: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  approvedTime: Date;

  @Column({ nullable: true })
  declinedTime: Date;

  @Column({ nullable: true })
  auditedTime: Date;

  @Column({ nullable: true })
  inDeviationTime: Date;

  @OneToMany(() => ConfirmSetContact, confirmSetContact => confirmSetContact.confirmSet, { cascade: true, onDelete: 'CASCADE' })
  contacts: ConfirmSetContact[]

  @OneToMany(() => ConfirmSetSegment, deviation => deviation.confirmSet, { cascade: true, onDelete: 'CASCADE' })
  segments: ConfirmSetSegment[]

  @Column({nullable: true , type: "simple-array"})
  certificates: string[];

  @Column({nullable: true, type: 'nvarchar'})
  auditRoundId: string;

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