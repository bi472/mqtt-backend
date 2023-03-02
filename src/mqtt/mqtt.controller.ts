import { MqttService } from './mqtt.service';
import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { MqttOptionsDto } from './dto/options';

@Controller('mqtt')
export class MqttController {

  private logger= new Logger(MqttController.name);

  constructor(
    private readonly service: MqttService) {}

  @Get('disconnect')
  async disconnect(
    @Body() body: { clientID: string}
  ): Promise<boolean>{
    return true
  }

  @Get('connect')
  async connect(
    @Body() mqttOptionsDto: MqttOptionsDto
  ): Promise<boolean>{
    return new Promise(
      (resolve, reject) => {
        this.service.connect(mqttOptionsDto, 
          (connected: boolean) => {
          resolve(connected)
        })
      }
    )
  }



  @Get('/subscribe')
  async subscribe(
    @Body() body: { topic: string },
  ): Promise<{ message: string }> {
      return new Promise((resolve, reject) => {
        this.service.subscribe(body.topic, 
          (message: string) => {
              this.logger.log(`Received message on ${body.topic}: ${message}`) 
              resolve({message})
            }
          );
      })
    }

  @Get('/publish')
  async publish(
    @Body() body: { topic: string, message: string}
  ): Promise<string> {
    this.service.publish(body.topic, body.message);
    return `Published ${body.message} to ${body.topic}`;
  }
}