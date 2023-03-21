import { Module } from '@nestjs/common';
import { MqttOptionsService } from './mqttoptions.service';
import { MqttOptionsController } from './mqttoptions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MqttOptions, MqttOptionsSchema } from './schemas/mqttOptions.schema';

@Module({
  imports: [ MongooseModule.forFeature([{ name: MqttOptions.name, schema: MqttOptionsSchema }]), ],
  controllers: [MqttOptionsController],
  providers: [MqttOptionsService]
})
export class MqttOptionsModule {}
