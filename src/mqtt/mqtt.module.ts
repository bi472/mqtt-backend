import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { MqttOptions, MqttOptionsSchema } from './schemas/mqttOptions.schema';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: MqttOptions.name, schema: MqttOptionsSchema }]),
        UsersModule,
    ],
    controllers: [MqttController],
    providers: [MqttService],
})

export class MqttModule {
}
