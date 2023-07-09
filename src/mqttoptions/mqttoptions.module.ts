import { Module } from '@nestjs/common';
import { MqttOptionsService } from './mqttoptions.service';
import { MqttOptionsController } from './mqttoptions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MqttOptions, MqttOptionsSchema } from './schemas/mqttOptions.schema';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MqttOptions.name, schema: MqttOptionsSchema }]), 
    UsersModule
  ],
  controllers: [MqttOptionsController],
  providers: [MqttOptionsService],
  exports: [MqttOptionsService]
})
export class MqttOptionsModule {}
