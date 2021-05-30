import { Injectable, BadRequestException, forwardRef, Inject, ForbiddenException } from '@nestjs/common';

import { mkdirSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import {  ConfirmSetService, CompanyService } from './';
import * as mime from 'mime';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../entities';
import { scan } from '../helpers/virus-scan.helper';


@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate) private readonly certificateRepossitory: Repository<Certificate>,
    @Inject(forwardRef(() => ConfirmSetService))  private readonly confirmSetService: ConfirmSetService,
    @Inject(forwardRef(() => CompanyService))  private readonly companyService: CompanyService,

    ) {
  }
  async addCertificate(
    req : {
      file: any,
      type: string,
      user: any,
      mimes: string[],
      confirmSetId: string,
      companyId: string
    }
  ): Promise<{id: string, name: string}> {
    [].includes
    if (!req.file?.mimetype || !req.mimes.includes(req.file.mimetype)) {
      throw new BadRequestException(`Failed to upload certificate file: File must be an certificate`);
    }
    if (!await this.getConfirmSet(req.confirmSetId, req.user) && !await this.getCompany(req.companyId, req.user)) {
      throw new ForbiddenException('company or confirm set not exist or you are not allowed to access these data');
    }
    const d = new Date();
    let key;
    switch (req.type) {
      case 'local':
        key = new Date().getTime() + '-' + req.file.originalname;
        mkdirSync(
          `../certificates/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}`,
          { recursive: true },
        );
        writeFileSync(
          `../certificates/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${key}`,
          req.file.buffer,
          'binary',
        );
        const scanResult = scan(`../certificates/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${key}`)
        if(!scanResult){
          throw new BadRequestException('the file have a virus or malware')
        }
        break;
      default:
        throw new BadRequestException(`not supported certificate storage`);
    }
    const certificate = await this.certificateRepossitory.save({
      key,
      confirmSetId: req.confirmSetId,
      companyId: req.companyId,
      type: req.type,
      contentType: req.file.mimetype,
      creator: req.user.sub,
      owner: req.user.owner,
    });
    return {id: certificate.id, name: key};
  }

  async getCertificate(id: string, requestUser: any)
  : Promise<any> {
    const certificate = await this.getCertificateFromDB(id, requestUser);
    if (!(await this.getConfirmSet(certificate.confirmSetId, requestUser)) && !(await this.getCompany(certificate.companyId, requestUser))) {
      throw new ForbiddenException('Not allowed to access these data');
    }
    const d = certificate.createdAt;
    let file;
    let contentType;
    switch (certificate.type) {
      case 'local':
        file = readFileSync(
          `../certificates/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${certificate.key}`,
        );
        contentType = mime.getType(
          `../certificates/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${certificate.key}`,
        );
        break;
      default:
        throw new BadRequestException(`not supported certificate storage`);
    }
    return {file: Buffer.from(file, 'binary').toString('base64'), contentType,name: certificate.key };
  }

  async removeCertificate(id: string, requestUser: any)
  : Promise<{message: string}> {
    const certificate = await this.getCertificateFromDB(id, requestUser);
    if (!(await this.getConfirmSet(certificate.confirmSetId, requestUser)) && !(await this.getCompany(certificate.companyId, requestUser))) {
      throw new ForbiddenException('Not allowed to access these data');
    }
    // remove next line if you want to allow deleting used certificates
    await this.isCertificateUsed(id, requestUser);
    const d = certificate.createdAt;
    switch (certificate.type) {
      case 'local':
        unlinkSync(
          `../certificates/${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}/${d.getHours()}/${certificate.key}`,
        );
        break;
      default:
        throw new BadRequestException(`not supported certificate storage`);
    }
    certificate && await this.certificateRepossitory.softRemove(certificate);  
    return { message: certificate ? 'Data deleted successfully' : 'no item to delete' };
  }
  async getCertificateFromDB(id: string, user: any) : Promise<Certificate> {
    const file = await this.certificateRepossitory.findOne({ where: { id, owner: user.owner } });
    if (!file) {
      throw new BadRequestException(`no file for this id`);
    }
    return file;
  }

  async isCertificateUsed(id: string, requestUser: any) {
    const {records: confirmSetsUseCertificate } = await this.confirmSetService.filter({certificateId: id}, requestUser);
    if (
      (confirmSetsUseCertificate && confirmSetsUseCertificate.length)
    ) {
      throw new BadRequestException(`Certificate is used, you can not delete used certificate.`);
    }
    return;
  }
  async getConfirmSet(confirmSetId, requestUser){
    if(confirmSetId)
      return await this.confirmSetService.getById(confirmSetId, requestUser)
  }
  async getCompany(companyId, requestUser){
    if(companyId)
      return await this.companyService.getById(companyId, requestUser)
  }
  async checkmanyCertificates(certificates, confirmSetId, requestMaker){
    const certs = await this.certificateRepossitory.createQueryBuilder('cert')
    .where("cert.id IN (:...certificates) AND cert.owner = :owner AND cert.confirmSetId = :confirmSetId",
    { certificates, owner: requestMaker.owner, confirmSetId}).getMany()
    return certs.length  === certificates.length;
  }
  async getConfirmSetSertificats(confirmSet, requestMaker){
    return confirmSet.certificates?.length ? await this.certificateRepossitory.createQueryBuilder('cert')
    .where("cert.id IN (:...certificates) AND cert.owner = :owner AND cert.confirmSetId = :confirmSetId",
    { certificates: confirmSet.certificates || [], owner: requestMaker.owner, confirmSetId: confirmSet.id})
    .select(['cert.id as id', 'cert.key as name']).getRawMany() : [];
  }
}
