import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { MqttOptionsModule } from 'src/mqttoptions/mqttoptions.module';
import { TemplatesModule } from 'src/templates/templates.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MqttOptionsModule,
        UsersModule,
        TemplatesModule
    ],
    controllers: [MqttController],
    providers: [MqttService],
})

export class MqttModule {
}
