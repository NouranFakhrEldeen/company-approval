import { Injectable, BadRequestException } from '@nestjs/common';

import { mkdirSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import * as mime from 'mime';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities';
import { scan } from '../helpers/virus-scan.helper';


@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private readonly imageRepossitory: Repository<Image>,
  ) {}
  async addImage(
    req : {
      file: any,
      type: string,
      user: any,
      mimes: string[],    }
  ): Promise<{id: string, name: string}> {
    [].includes
    if (!req.file?.mimetype || !req.mimes.includes(req.file.mimetype)) {
      throw new BadRequestException(`Failed to upload image file: File must be an image`);
    }
    const d = new Date();
    let key;
    switch (req.type) {
      case 'local':
        key = new Date().getTime() + '-' + req.file.originalname;
        mkdirSync(
          `../images/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}`,
          { recursive: true },
        );
        writeFileSync(
          `../images/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${key}`,
          req.file.buffer,
          'binary',
        );
        const scanResult = scan(`../images/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${key}`);
        if(!scanResult){
          throw new BadRequestException('the file have a virus or malware')
        }
        break;
      default:
        throw new BadRequestException(`not supported image storage`);
    }
    const image = await this.imageRepossitory.save({
      key,
      type: req.type,
      contentType: req.file.mimetype,
      creator: req.user.sub,
      owner: req.user.owner,
    });
    return {id: image.id, name: key};
  }

  async getImage(id: string, requestUser: any)
  : Promise<any> {
    const image = await this.getImageFromDB(id, requestUser);
    const d = image.createdAt;
    let file;
    let contentType;
    switch (image.type) {
      case 'local':
        file = readFileSync(
          `../images/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${image.key}`,
        );
        contentType = mime.getType(
          `../images/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${image.key}`,
        );
        break;
      default:
        throw new BadRequestException(`not supported image storage`);
    }
    return {file: Buffer.from(file, 'binary').toString('base64'), contentType,name: image.key };
  }

  async removeImage(id: string, requestUser: any)
  : Promise<{message: string}> {
    const image = await this.getImageFromDB(id, requestUser);
    const d = image.createdAt;
    switch (image.type) {
      case 'local':
        unlinkSync(
          `../images/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${image.key}`,
        );
        break;
      default:
        throw new BadRequestException(`not supported image storage`);
    }
    image && await this.imageRepossitory.softRemove(image);  
    return { message: image ? 'Data deleted successfully' : 'no item to delete' };
  }
  async getImageFromDB(id: string, user: any) : Promise<Image> {
    const file = await this.imageRepossitory.findOne({ where: { id, owner: user.owner } });
    if (!file) {
      throw new BadRequestException(`no file for this id`);
    }
    return file;
  }
}
