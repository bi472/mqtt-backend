import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';

@Module({
    imports: [
        ConfigModule.forRoot()
    ],
    controllers: [MqttController],
    providers: [MqttService],
})

export class MqttModule {
}
