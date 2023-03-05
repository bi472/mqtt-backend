import { MqttService } from './mqtt.service';
import { Body, Controller, Get, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MqttOptionsDto } from './dto/base-options'
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('mqtt')
export class MqttController {

  private logger = new Logger(MqttController.name);

  constructor(
    private readonly mqttService: MqttService
    ) {}

  @UseGuards(AccessTokenGuard)
  @Get('connect')
  async connect(
    @Req() req: Request,
    @Body() body: { mqttOptionsID: string , mqttOptionsDto: MqttOptionsDto }
  ): Promise<boolean>{
    return new Promise(
      async (resolve, reject) => {
        const mqttOptionsDto = await this.mqttService.findUserMqttOptionsByID(body.mqttOptionsID, req.user['sub'])
        this.mqttService.connect(mqttOptionsDto ? mqttOptionsDto : body.mqttOptionsDto, 
          (connected: boolean) => { resolve(connected) })
      }
    )
  }

  @UseGuards(AccessTokenGuard)
  @Post('mqttoptions')
  async createMqttOptions(
    @Req() req: Request,
    @Body() mqttOptionsDto: MqttOptionsDto
  ) : Promise<any>{
    return await this.mqttService.createMqttOptions(mqttOptionsDto, req.user['sub'])
  }

  @UseGuards(AccessTokenGuard)
  @Get('mqttoptions')
  async findMqttOptions(
    @Req() req: Request
  ) : Promise<any>{
    return await this.mqttService.findUserMqttOptions(req.user['sub'])
  }


  @UseGuards(AccessTokenGuard)
  @Get('/subscribe')
  async subscribe(
    @Body() body: { topic: string },
  ): Promise<{ message: string }> {
      return new Promise((resolve, reject) => {
        this.mqttService.subscribe(body.topic, 
          (message: string) => {
              this.logger.log(`Received message on ${body.topic}: ${message}`) 
              resolve({message})
            }
          );
      })
    }
  
  @UseGuards(AccessTokenGuard)
  @Get('/publish')
  async publish(
    @Body() body: { topic: string, message: string}
  ): Promise<string> {
    this.mqttService.publish(body.topic, body.message);
    return `Published ${body.message} to ${body.topic}`;
  }
}