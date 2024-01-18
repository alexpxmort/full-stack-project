/* eslint-disable @typescript-eslint/no-var-requires */
import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import * as csvtojson from 'csvtojson';
import { ApiTags, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileUploadDto } from 'src/dtos/fileUpload';

@Controller('csv')
@ApiTags('csv')
export class CsvController {
  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'arquivo pra analise',
    type: FileUploadDto,
  })
  @HttpCode(200)
  @ApiResponse({ status: 400, description: 'Formato de arquivo invalido' })
  @ApiResponse({ status: 200, description: 'Retorna os dados das metricas' })
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    console.log(file);
    if (file.mimetype.includes('csv')) {
      return this.readCsv(file.buffer);
    } else if (
      file.mimetype.includes(
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
    ) {
      if (this.hasXlsExtension(file.originalname)) {
        return await this.readExcel(file.buffer);
      } else {
        throw new BadRequestException('Formato de arquivo inválido');
      }
    } else {
      throw new BadRequestException('Formato de arquivo inválido');
    }
  }

  private hasXlsExtension(filename: string): boolean {
    return filename.toLowerCase().endsWith('.xlsx');
  }
  private async readCsv(buffer: Buffer): Promise<any[]> {
    try {
      const bufferString = buffer.toString('utf-8');
      const jsonArray = await csvtojson().fromString(bufferString);
      return jsonArray;
    } catch (error) {
      throw error;
    }
  }

  private async readExcel(buffer: Buffer) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return jsonData;
  }
}
