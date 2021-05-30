import { Controller, UseGuards, Post, UseInterceptors, UploadedFile, Param, Get, Delete, Res, UsePipes, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody  } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
// Services
import { CertificateService } from '../services';
import { AuthGuard } from '@nestjs/passport';

// DTO
import { CertificatUploadDto, CreateCertificateDto, CreateCertificateSchema, IdSchema } from '../dto';

// Guards
import { ScopesGuard } from '../guards';

// Decorators
import { Scopes, User, CertificateStorage, FileMimes } from '../decorators';
import { JoiValidationPipe } from '../pipes';


@ApiBearerAuth()

@ApiTags('Certificate')
@Controller('')
export class CertificateController {
  constructor(private readonly certificatesService: CertificateService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Certificate',
    type: CertificatUploadDto,
  })
  @UsePipes(new JoiValidationPipe({
    body: CreateCertificateSchema,
  }))
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('certificates:create')
  async create(
    @Body() body: CreateCertificateDto,
    @UploadedFile() file,
    @User() user: any,
    @CertificateStorage() type: string,
    @FileMimes(['application/pdf', 'image/jpg', 'image/png', 'image/jpeg']) mimes: string[],
  ): Promise<{id: string, name: string}> {
    try {
      return await this.certificatesService.addCertificate({
        file, type, user, mimes,
        confirmSetId: body.confirmSetId,
        companyId: body.companyId,
      });
    } catch (error) {
      throw error;
    }
  }
  @Get(':id')
  @UseGuards(AuthGuard(), ScopesGuard)
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    }
  }))
  @Scopes('certificates:read')
  async get(
    @User() user: any,
    @Param('id') id: string,
    @Res() res: any,
  ): Promise<any> {
    try {
      return res.send(await this.certificatesService.getCertificate(id, user));
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('certificates:remove')
  @UsePipes(new JoiValidationPipe({
    param: {
      id: IdSchema,
    }
  }))
  async delete(
    @User() user: any,
    @Param('id') id: string,
  ): Promise<{message: string}> {
    try {
      return await this.certificatesService.removeCertificate(id, user);
    } catch (error) {
      throw error;
    }
  }
}
