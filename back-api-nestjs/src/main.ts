import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define your CORS options
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  // Enable CORS with the defined options
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('API BACK END NESTJS')
    .setDescription('Api NestJs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
