import { Module } from '@nestjs/common';
import { MqttoptionsService } from './mqttoptions.service';
import { MqttoptionsController } from './mqttoptions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MqttOptions, MqttOptionsSchema } from './schemas/mqttOptions.schema';

@Module({
  imports: [ MongooseModule.forFeature([{ name: MqttOptions.name, schema: MqttOptionsSchema }]), ],
  controllers: [MqttoptionsController],
  providers: [MqttoptionsService]
})
export class MqttoptionsModule {}
