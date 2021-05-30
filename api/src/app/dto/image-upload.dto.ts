import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadDto {
  @ApiProperty({description: 'Binary image file', type: 'string', format: 'binary' })
  file: any;

}
