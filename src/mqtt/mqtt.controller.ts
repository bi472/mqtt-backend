import { MqttService } from './mqtt.service';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('mqtt')
export class MqttController {
    constructor(private readonly service: MqttService) {}

    @Get('/subscribe')
  subscribe(): string {
    this.service.subscribe('my/topic', (message) => {
      console.log(`Received message: ${message}`);
    });

    return 'Subscribed to topic';
  }

  @Get('/publish')
  publish(): string {
    this.service.publish('cmnd/tasmota_EB0ADA/power', 'off');
    return 'Published message';
  }
}