import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { MqttOptions, MqttOptionsSchema } from '../mqttoptions/schemas/mqttOptions.schema';

@Module({
    imports: [
        ConfigModule.forRoot(),
        UsersModule,
    ],
    controllers: [MqttController],
    providers: [MqttService],
})

export class MqttModule {
}
