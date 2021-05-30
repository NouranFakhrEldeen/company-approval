import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
import { ConfirmSetSegment } from '.';
import { DeviationFeedbackHistory } from './deviation-feedback-history.entity';

  @Entity()
  export class Deviation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'nvarchar'})
    confirmSetId: string;

    @ManyToOne(() => ConfirmSetSegment, confirmSetSegment => confirmSetSegment.deviations)
    @JoinColumn([{ name: "confirmSetSegmentId", referencedColumnName: "id" }])
    confirmSetSegment: ConfirmSetSegment;

    @Column({type: 'nvarchar'})
    confirmSetSegmentId: string;

    @Column({ type: 'nvarchar' })
    status: string;

    @Column({ nullable: true, type: 'nvarchar' })
    number: string;

    @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
    description: string;

    @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
    howToFix: string;

    @Column({ nullable: true, type: 'nvarchar', length: 'MAX' })
    item: string;
    
    @Column({ nullable: true, type: "simple-array" })
    images: string[];

    @Column({ nullable: true, type: "int", default: 0 })
    retryNo: number;

    @OneToMany(() => DeviationFeedbackHistory,
      DeviationFeedbackHistory => DeviationFeedbackHistory.deviation,
      { cascade: true, onDelete: 'CASCADE' },
    )
    feedbackHistory: DeviationFeedbackHistory[]
  
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