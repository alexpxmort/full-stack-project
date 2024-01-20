import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';

describe('CsvController (e2e)', () => {
  let app: INestApplication;
  const BASE_URL = '/doc/upload-doc';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /doc', () => {
    it('should return status code 400 WHEN no file is sent', () => {
      return request(app.getHttpServer())
        .post(`${BASE_URL}`)
        .send({})
        .expect(400)
        .expect({
          message: 'Nenhum arquivo enviado',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return status code 400 WHEN a invalid file is sent', () => {
      const filePath = path.resolve(__dirname, 'test.txt');
      const fileContent = fs.readFileSync(filePath);
      return request(app.getHttpServer())
        .post(`${BASE_URL}`)
        .attach('file', fileContent, 'test.txt')
        .expect({
          message: 'Formato de arquivo inválido',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return status code 200 and success message WHEN a valid file is sent', () => {
      const filePath = path.resolve(__dirname, 'modelo-teste-full-stack.xlsx');
      const fileContent = fs.readFileSync(filePath);
      return request(app.getHttpServer())
        .post(`${BASE_URL}`)
        .attach('file', fileContent, 'modelo-teste-full-stack.xlsx')
        .expect(200);
    });
  });
});
