import { 
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'nvarchar', length: 2000})
  @Unique(['name', 'owner'])
  name: string;

  @Column("simple-array")
  scopes: string[];

  // ===============================system data===================================

  @CreateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
  createdAt: Date;
  
  @UpdateDateColumn({ default: () => `CURRENT_TIMESTAMP`, nullable: true })
  updatedAt: Date;

  @Column({ nullable: true, type: 'nvarchar', length: 1000 })
  creator: string

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;

  @Column({type: 'nvarchar', length: 1000})
  owner: string;

}