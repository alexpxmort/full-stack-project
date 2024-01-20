import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { DocController } from './doc/doc.controller';
import { MetricsService } from './metrics/metrics.service';

@Module({
  imports: [MulterModule.register()],
  controllers: [DocController],
  providers: [MetricsService],
})
export class AppModule {}
