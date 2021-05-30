import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  @Entity()
  export class Metadata {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: true })
    lastSyncTime: Date;
  
    // ===============================system data===================================
  
    @CreateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
    createdAt: Date;
  
    @UpdateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
    updatedAt: Date;
  
    @DeleteDateColumn({ nullable: true, select: false })
    deletedAt: Date;
  
    @Column({type: 'nvarchar', length: 1000})
    owner: string;
  
  }