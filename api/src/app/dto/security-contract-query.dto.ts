import { ApiProperty } from '@nestjs/swagger';
import * as Joi from '@hapi/joi';
import { ContractSortPropertiesEnum, SortTypeEnum } from '../enums';


export class SecurityContractQueryDTO {

    @ApiProperty({ description: 'service provider name', type: String, required: false })
    service_provider_name: string;
    @ApiProperty({ description: 'service provider bussiness id', type: String, required: false })
    service_provider_business_id: string;
    @ApiProperty({ description: 'service provider vat id', type: String, required: false })
    service_provider_vat_id: string;
    @ApiProperty({ description: 'contract number', type: String, required: false })
    contract_number: string;
    @ApiProperty({ description: 'contract number', type: String, required: false })
    contract_name: string;
    @ApiProperty({ description: 'public name', type: String, required: false })
    name_public: string;
    @ApiProperty({ description: `Sort type "${Object.keys(SortTypeEnum).join()}"`, enum: SortTypeEnum, required: false })
    sortType: string;
    @ApiProperty({ description: `Sort property "${Object.keys(ContractSortPropertiesEnum).join()}"`, enum: ContractSortPropertiesEnum, required: false })
    sortProperty: string;
    @ApiProperty({ description: 'From Date', type: Date, required: false })
    from: Date;
    @ApiProperty({ description: 'To Date', type: Date, required: false })
    to: Date;
    @ApiProperty({ description: 'From start Date', type: Date, required: false })
    fromStartdate: Date;
    @ApiProperty({ description: 'To start Date', type: Date, required: false })
    toStartdate: Date;
    @ApiProperty({ description: 'From end Date', type: Date, required: false })
    fromEnddate: Date;
    @ApiProperty({ description: 'From end Date', type: Date, required: false })
    toEnddate: Date;
    @ApiProperty({ description: 'the page no for pangination', required: false })
    page?: string;

    @ApiProperty({ description: 'the size of the page for pangination with max 1000, default 20', required: false })
    size?: string;
}

const SecurityContractQuerySchemaFactory = () => {
    const schema: any = {
        service_provider_name: Joi.string(),
        service_provider_business_id: Joi.string(),
        service_provider_vat_id: Joi.string(),
        contract_number: Joi.string(),
        contract_name: Joi.string(),
        name_public: Joi.string(),
        fromStartdate: Joi.date(),
        toStartdate: Joi.date(),
        fromEnddate: Joi.date(),
        toEnddate: Joi.date(),
        from: Joi.date(),
        to: Joi.date(),
        sortType: Joi.string().valid(...Object.keys(SortTypeEnum)),
        sortProperty: Joi.string().valid(...Object.keys(ContractSortPropertiesEnum)),
        size: Joi.number().min(1).max(1000),
        page: Joi.number().min(1),
    }
    return Joi.object().keys(schema);
};
export const SecurityContractQuerySchema = SecurityContractQuerySchemaFactory();
