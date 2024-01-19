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
import { format, subDays } from 'date-fns';
import { MetricsService } from 'src/metrics/metrics.service';
import { SubscriptionDTO } from 'src/dtos/subscription';

@Controller('csv')
@ApiTags('csv')
export class CsvController {
  constructor(private metricsService: MetricsService) {}
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

    if (file.mimetype.includes('csv')) {
      const csvData = await this.readCsv(file.buffer);
      const monthRateRevenue =
        await this.metricsService.calculateMRRMonthly(csvData);
      const churnRate = this.metricsService.calculateChurnRate(
        csvData,
        monthRateRevenue,
      );
      return {
        monthRateRevenue,
        churnRate,
      };
    } else if (
      file.mimetype.includes(
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      )
    ) {
      if (this.hasXlsExtension(file.originalname)) {
        const excelData = await this.readExcel(file.buffer);
        const monthRateRevenue =
          await this.metricsService.calculateMRRMonthly(excelData);
        const churnRate = this.metricsService.calculateChurnRate(
          excelData,
          monthRateRevenue,
        );
        return {
          monthRateRevenue,
          churnRate,
        };
      } else {
        throw new BadRequestException('Formato de arquivo inválido');
      }
    } else {
      throw new BadRequestException('Formato de arquivo inválido');
    }
  }

  private formatJson(data: any[]) {
    return data.map((row: any) => ({
      quantidadeCobrancas: parseInt(row['quantidade cobranças']),
      cobradaACadaXDias: parseInt(row['cobrada a cada X dias']),
      dataInicio: this.getDate(row['data início']),
      status: row['status'],
      dataStatus: this.getDate(row['data status']),
      dataCancelamento: row['data cancelamento']
        ? this.getDate(row['data cancelamento'])
        : null,
      valor: isNaN(row['valor']) ? parseFloat(row['valor']) : row['valor'],
      proximoCiclo: row['próximo ciclo'],
      idAssinante: row['ID assinante'],
    })) as SubscriptionDTO[];
  }
  private hasXlsExtension(filename: string): boolean {
    return filename.toLowerCase().endsWith('.xlsx');
  }
  private async readCsv(buffer: Buffer): Promise<any[]> {
    try {
      const bufferString = buffer.toString('utf-8');
      const jsonArray = await csvtojson().fromString(bufferString);

      const subscriptions = this.formatJson(jsonArray);

      return subscriptions;
    } catch (error) {
      throw error;
    }
  }

  private getDate(dateObj: number | string) {
    if (typeof dateObj === 'number') {
      const dataReal = subDays(new Date(1900, 0, dateObj), 1);
      const dataFormatada = format(dataReal, 'dd/MM/yyyy HH:mm');
      return dataFormatada as string;
    }

    return new Date(dateObj).toLocaleDateString('pt-br');
  }
  private async readExcel(buffer: Buffer) {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const subscriptions = this.formatJson(jsonData);

    return subscriptions;
  }
}
