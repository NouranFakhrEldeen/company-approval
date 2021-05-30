import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { Company } from '.';
  
  @Entity()
  export class SecurityContract {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 256})
    service_provider_name: string;

    @Column({ type: 'nvarchar', length: 500 })
    service_provider_business_id: string;

    @Column({type: 'varchar', length: 32})
    service_provider_vat_id: string;

    @Column({type: 'varchar', length: 128})
    contract_number: string;

    @Column({type: 'varchar', length: 1024})
    contract_name: string;

    @Column({type: 'varchar', length: 1024})
    name_public: string;

    @Column({nullable: true,})
    startdate: Date;

    @Column({nullable: true,})
    enddate: Date;

    @ManyToOne(() => Company, company => company.securityContracts)
    @JoinColumn([{ name: "service_provider_business_id", referencedColumnName: "businessId" }])
    company?: Company;
  

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