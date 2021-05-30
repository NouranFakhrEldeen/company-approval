import { 
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { ConfirmSet } from '.';
import { SecurityContract } from './security-contract.entity';
@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', length: 2000 })
  @Unique(['name', 'owner'])
  name: string;

  @Column({ type: 'nvarchar', length: 500 })
  @Unique(['businessId', 'owner'])
  businessId: string;

  @Column({nullable: true})
  securityContractId: string;

  @Column({nullable: true})
  securityContractFrom: Date;

  @Column({nullable: true})
  securityContractTo: Date;

  @OneToMany(() => ConfirmSet, confirmSet => confirmSet.company)
  confirmSets: ConfirmSet[]

  @OneToMany(() => SecurityContract, securityContract => securityContract.company)
  securityContracts: SecurityContract[]
  

  @Column({nullable: true, type: "simple-array"})
  certificates: string[]
  
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