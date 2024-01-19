import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvController } from './csv/csv.controller';
import { MetricsService } from './metrics/metrics.service';

@Module({
  imports: [MulterModule.register()],
  controllers: [AppController, CsvController],
  providers: [AppService, MetricsService],
})
export class AppModule {}
