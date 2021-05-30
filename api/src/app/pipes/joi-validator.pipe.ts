import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: {body?: any, query?: any, param?: any}) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const schemaObject = this.schema[metadata.type]?.[metadata.data] || this.schema[metadata.type];
    const { error } = schemaObject?.validate ? schemaObject.validate(value) : {error: undefined};
    if (error) {
      throw new BadRequestException({error, value});
    }
    return value;
  }
}
