import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'

async function bootstrap() {
  console.log(process.env.mongoURL)
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const port = process.env.port;
  await app.listen(port);
}
bootstrap();