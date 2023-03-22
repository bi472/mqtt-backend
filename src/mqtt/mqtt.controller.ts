import { MqttService } from './mqtt.service';
import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MqttOptionsDto } from '../mqttoptions/dto/base-options'
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MqttOptionsService } from 'src/mqttoptions/mqttoptions.service';
import { TemplatesService } from 'src/templates/templates.service';

@Controller('mqtt')
export class MqttController {

  private logger = new Logger(MqttController.name);

  constructor(
    private readonly mqttService: MqttService,
    private readonly mqttOptionsService: MqttOptionsService,
    private readonly templatesService: TemplatesService
    ) {}

  @UseGuards(AccessTokenGuard)
  @Get('connect')
  async connect(
    @Req() req: Request,
    @Body() body: { mqttOptionsID: string , mqttOptionsDto: MqttOptionsDto }
  ): Promise<any>{

    try {
    const promise =  new Promise(
      async (resolve, reject) => {
        console.log(body.mqttOptionsID)
        const mqttOptionsDto = await this.mqttOptionsService.findUserMqttOptionsByID(body.mqttOptionsID, req.user['sub'])
        console.log(mqttOptionsDto)
        this.mqttService.connect(mqttOptionsDto ? mqttOptionsDto : body.mqttOptionsDto, 
          (connected: boolean) => { 
            resolve(connected)
          })
      }
    )

    return promise
    }
    catch(e) {
      console.log('Catch an error: ', e)
    }
  }


  @UseGuards(AccessTokenGuard)
  @Get('/subscribe')
  async subscribe(
    @Req() req: Request,
    @Body() body: { topic: string, templateID: string},
  ) {
      const template = await this.templatesService.findUserTemplateByID(req.user['sub'], body.templateID)
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
    const template = await this.templatesService.findUserTemplateByID(req.user['sub'], body.templateID)
    this.mqttService.publish(body.topic ? body.topic : template.topic, body.message ? body.message : template.message);
    return `Published ${body.message} to ${body.topic}`;
  }
}