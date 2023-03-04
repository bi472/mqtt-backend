import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MqttModule,
    MongooseModule.forRoot(process.env.mongoURL),
    UsersModule,
    AuthModule,
    TemplatesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
