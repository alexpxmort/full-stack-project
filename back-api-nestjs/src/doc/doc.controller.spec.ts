import { Test, TestingModule } from '@nestjs/testing';
import { DocController } from './doc.controller';
import { MetricsService } from 'src/metrics/metrics.service';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import * as fs from 'fs';
import * as path from 'path';

describe('DocController', () => {
  let controller: DocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocController],
      providers: [MetricsService],
    }).compile();

    controller = module.get<DocController>(DocController);
  });

  describe('uploadDoc', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should throw BadRequestException WHEN no file is provided', async () => {
      await expect(controller.uploadDoc(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should process CSV file and return metrics', async () => {
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'test',
        'modelo-teste-full-stack.xlsx',
      );
      const fileBuffer = fs.readFileSync(filePath);
      const file: any = {
        fieldname: 'file',
        originalname: 'modelo-teste-full-stack.xlsx',
        encoding: '7bit',
        mimetype: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: fileBuffer,
        size: fileBuffer.length,
      };

      const result = await controller.uploadDoc(file);

      expect(result).toBeDefined();
      expect(result.monthRateRevenue).toBeDefined();
      expect(result.churnRate).toBeDefined();
    });
  });
});
