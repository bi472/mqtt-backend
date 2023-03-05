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
    @Req() req: Request,
    @Body() body: { topic: string, templateID: string},
  ) {
      const template = await this.mqttService.findUserTemplatesByID(body.templateID, req.user['sub'])
      this.mqttService.subscribe(template.topic, 
        (message: string) => {
            this.logger.log(`Received message on ${template.topic}: ${message}`) 
        })
    }
  
  @UseGuards(AccessTokenGuard)
  @Get('/publish')
  async publish(
    @Req() req: Request,
    @Body() body: { topic: string, message: string, templateID: string},
  ): Promise<string> {
    const template = await this.mqttService.findUserTemplatesByID(body.templateID, req.user['sub'])
    console.log(template.topic, template.message)
    this.mqttService.publish(body.topic ? body.topic : template.topic, body.message ? body.message : template.message);
    return `Published ${body.message} to ${body.topic}`;
  }
}