import { Injectable } from '@nestjs/common';
import { NodeMailerService } from '../smtp-servers/nodemailer.service';

@Injectable()
export class SmtpServers {
    constructor(private readonly nodemailer: NodeMailerService) {}
    async getAll() :Promise<any[]> {
        return [
            this.nodemailer,
        ];
    }
}
