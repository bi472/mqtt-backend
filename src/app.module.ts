import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';
import { MqttOptionsModule } from './mqttoptions/mqttoptions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MqttModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        uri: configService.get('mongoURL'),
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    TemplatesModule,
    MqttOptionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
