import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'
import {nestCsrf} from 'ncsrf';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MqttModule } from './mqtt/mqtt.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';
import { MqttOptionsModule } from './mqttoptions/mqttoptions.module';

async function bootstrap() {
  console.log(process.env.mongoURL)
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)

  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser());
  app.use(nestCsrf());

  const options = new DocumentBuilder()
  .setTitle('MQTT backend')
  .setDescription('It is API for communicate with IOT devices by protocol MQTT! Sign up for describe!')
  .setVersion('1.0')
  .addBearerAuth()
  .addCookieAuth()
  .build();
  
  const document = SwaggerModule.createDocument(app, options, {
    include: [
      AuthModule,
      MqttModule,
      TemplatesModule,
      MqttOptionsModule
    ],
  });
  SwaggerModule.setup('docs', app, document);


  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();