import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { MqttOptionsService } from 'src/mqttoptions/mqttoptions.service';
import { TemplatesService } from 'src/templates/templates.service';

@Module({
    imports: [
        ConfigModule.forRoot(),
        UsersModule,
    ],
    controllers: [MqttController],
    providers: [MqttService, MqttOptionsService, TemplatesService],
})

export class MqttModule {
}
