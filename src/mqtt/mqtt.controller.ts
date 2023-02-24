import { MqttService } from './mqtt.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('mqtt')
export class MqttController {
    constructor(private readonly service: MqttService) {}

    @Get('publish')
    async publish(){
        return await this.service.publish();
    }

    @Get('connect')
    async connect() {
        return await this.service.connect();
    }
}