import { MqttService } from './mqtt.service';
import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';

@Controller('mqtt')
export class MqttController {

  private logger= new Logger(MqttController.name);

  constructor(
    private readonly service: MqttService) {}

  @Get('connect')
  connect(): string{
    this.service.connect({
      host: process.env.mqttHost,
      port: +process.env.mqttPort,
      username: process.env.mqttUser,
      password: process.env.mqttPass, 
      sslConnection: true,
    })
    return `Connected to server`
  }



  @Get('/subscribe')
  async subscribe(
    @Query('topic') topic: string,
  ): Promise<{ message: string }> {
      return new Promise((resolve, reject) => {
        this.service.subscribe(topic, 
          (message: string, error?: Error) => {
            if (!error){
              this.logger.log(`Received message on ${topic}: ${message}`) 
              resolve({message})
            }
          });
      })
    }

  @Get('/publish')
  publish(
    @Query('topic') topic: string,
    @Query('message') message: string
  ): string {
    this.service.publish(topic, message);
    return 'Published message';
  }
}