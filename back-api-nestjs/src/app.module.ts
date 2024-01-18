import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsvController } from './csv/csv.controller';

@Module({
  imports: [MulterModule.register()],
  controllers: [AppController, CsvController],
  providers: [AppService],
})
export class AppModule {}
