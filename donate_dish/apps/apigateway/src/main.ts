import { NestFactory } from '@nestjs/core';
import { ApigatewayModule } from './apigateway.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApigatewayModule);
  app.enableCors(
    {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: '*',
      credentials: true,
    }
  );
  const config = new DocumentBuilder()
    .setTitle('Donation of free dishes')
    .setDescription('The api allows you to generate a random order of 6 different dishes')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  
  await app.listen(+process.env.APIGATEWAY_PORT || 3000);
}
bootstrap();
