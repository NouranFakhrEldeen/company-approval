import { Controller, UseGuards, Post, UseInterceptors, UploadedFile, Param, Get, Delete, Res, UsePipes, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody  } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
// Services
import { ImageService } from '../services';
import { AuthGuard } from '@nestjs/passport';

import { ImageUploadDto, IdSchema } from '../dto';

import { ScopesGuard } from '../guards';

import { Scopes, User, ImageStorage, FileMimes } from '../decorators';
import { JoiValidationPipe } from '../pipes';


@ApiBearerAuth()

@ApiTags('Image')
@Controller('')
export class ImageController {
  constructor(private readonly imagesService: ImageService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image',
    type: ImageUploadDto,
  })
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('images:create')
  async create(
    @UploadedFile() file,
    @User() user: any,
    @ImageStorage() type: string,
    @FileMimes(['image/jpg', 'image/png', 'image/jpeg']) mimes: string[],
  ): Promise<{id: string, name: string}> {
    try {
      return await this.imagesService.addImage({file, type, user, mimes});
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
  @Scopes('images:read')
  async get(
    @User() user: any,
    @Param('id') id: string,
    @Res() res: any,
  ): Promise<any> {
    try {
      return res.send(await this.imagesService.getImage(id, user));
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), ScopesGuard)
  @Scopes('images:remove')
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
      return await this.imagesService.removeImage(id, user);
    } catch (error) {
      throw error;
    }
  }
}
