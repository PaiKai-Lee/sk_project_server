import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get('PORT');
  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'Content-Type',
      'Content-Length',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  // setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Sk_project')
    .setDescription('Sk_project 後端 API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(PORT, () =>
    console.log(`server is listen on http://localhost:${PORT}`),
  );
}
bootstrap();
