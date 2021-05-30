import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';

  @Entity()
  export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'nvarchar', length: 'MAX' })
    key: string;

    @Column({ type: 'nvarchar', length: 50 })
    type: string;

    @Column({ type: 'nvarchar', length: 100 })
    contentType: string;
    
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