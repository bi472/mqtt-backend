import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'
import {nestCsrf} from 'ncsrf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log(process.env.mongoURL)
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());
  app.use(nestCsrf());
  const port = process.env.port;
  await app.listen(port);
}
bootstrap();