import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'
import {nestCsrf} from 'ncsrf';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  console.log(process.env.mongoURL)
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());
  app.use(nestCsrf());

  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();