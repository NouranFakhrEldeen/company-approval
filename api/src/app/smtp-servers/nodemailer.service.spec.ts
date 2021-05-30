import { Test } from '@nestjs/testing';
import { NodeMailerService } from './nodemailer.service';
import {  HttpModule } from '@nestjs/common';
import { SmtpServers } from '../services/smtp-servers.service';

describe('Messages Service', () => {
  let nodeMailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ SmtpServers, NodeMailerService],
    }).compile();

    nodeMailerService = module.get<NodeMailerService>(NodeMailerService);
  });

  describe('NodeMailer Service', () => {
    it('Valid Email request', async () => {
      nodeMailerService.transporter.sendMail = jest.fn();
      nodeMailerService.transporter.sendMail.mockResolvedValue('some response value');
      const message = {
        type: 'EMAIL',
        sender: 'test@test.com',
        recipients: [{ type: 'NORMAL', email: 'test@test.com' }],
        subject: 'test',
        body: 'string',
        attachments: [{ type: 'INLINE', name: 'test', content: { type: 'test', length: 1024, data: 'dGVzdA==' } }],
      };
      const result = await nodeMailerService.send(message);
      expect(nodeMailerService.transporter.sendMail).toHaveBeenCalled();
      expect(result).toEqual('some response value');
    });
    it('server error', async () => {
      nodeMailerService.transporter.sendMail = jest.fn();
      nodeMailerService.transporter.sendMail.mockRejectedValue(new Error('error'));
      const message = {
        type: 'EMAIL',
        sender: 'test@test.com',
        recipients: [{ type: 'NORMAL', email: 'test@test.com' }],
        subject: 'test',
        body: 'string',
        attachments: [{ type: 'INLINE', name: 'test', content: { type: 'test', length: 1024, data: 'dGVzdA==' } }],
      };
      const result = await nodeMailerService.send(message);
      expect(nodeMailerService.transporter.sendMail).toHaveBeenCalled();
      expect(result).toEqual(undefined);
    });
  });
});
