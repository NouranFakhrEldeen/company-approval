import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    ManyToOne,
  } from 'typeorm';
import { Deviation } from '.';

  @Entity()
  export class DeviationFeedbackHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'nvarchar'})
    deviationId: string;

    @ManyToOne(() => Deviation, deviation => deviation.feedbackHistory)
    @JoinColumn([{ name: "deviationId", referencedColumnName: "id" }])
    deviation: Deviation;

    @Column({ nullable: true, type: "nvarchar", length: 'MAX' })
    howItWasFixed: string;

    @Column({ nullable: true, type: "nvarchar", length: 'MAX' })
    comment: string;

    @Column({ nullable: true, type: "int", default: 0 })
    retryNo: number;

    @Column({ nullable: true, type: "nvarchar", length: 'MAX' })
    serviceProviderEmail: string;

    @Column({ nullable: true, type: "nvarchar", length: 'MAX' })
    adminEmail: string;

    @Column({nullable: true})
    serviceProviderCommentDate: Date;

    @Column({nullable: true})
    adminCommentDate: Date;
  
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