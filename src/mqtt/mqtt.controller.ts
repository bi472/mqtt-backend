import { MqttService } from './mqtt.service';
import { BadRequestException, Body, Controller, Delete, Get, HttpException, InternalServerErrorException, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
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
    const promise =  new Promise(
      async (resolve, reject) => {
        setTimeout(() => {resolve(`The waiting time has expired.`)}, 20000)
        if (this.mqttService.checkConnection()) return `You are already connected to the server`
        const mqttOptionsDto = await this.mqttOptionsService.findUserMqttOptionsByID(body.mqttOptionsID, req.user['sub'])
        console.log(body.mqttOptionsID, req.user['sub'])
        this.mqttService.connect(mqttOptionsDto ? mqttOptionsDto : body.mqttOptionsDto, 
          (connected: boolean, errorMessage: string) => {
             connected ? resolve('Succesfully connected!') : resolve(`Closed connection with ${errorMessage}`)
          })
      }
    )
    
    return promise
  }





  @UseGuards(AccessTokenGuard)
  @Get('/subscribe')
  async subscribe(
    @Req() req: Request,
    @Body() body: { templateID: string},
  ): Promise<any> {
    if (!this.mqttService.checkConnection()) return `You are not connected to the server.`
      const template = await this.templatesService.findUserTemplateByID(req.user['sub'], body.templateID)
      const promise = new Promise(
        async (resolve, reject) => {
          setTimeout(() => {resolve(`You are haven't recieved any message. The waiting time has expired.`)}, 100000)
          this.mqttService.subscribe(template.topic, 
            (message: string) => {
              this.logger.log(`Received message on ${template.topic}: ${message}`)
                resolve(`Received message on ${template.topic}: ${message}`)
            })
          
      })

      promise.then(() => {this.mqttService.unsubscribe(template.topic)})

      return promise
    }
  
  @UseGuards(AccessTokenGuard)
  @Get('/publish')
  async publish(
    @Req() req: Request,
    @Body() body: { templateID: string},
  ): Promise<string> {
    if (!this.mqttService.checkConnection()) return `You are not connected to the server.`
    setTimeout(() => {return(`The waiting time has expired. Check the connection to the server.`)}, 10000)
    const template = await this.templatesService.findUserTemplateByID(req.user['sub'], body.templateID)
    this.mqttService.publish(template.topic,template.message);
    return `Published ${template.topic} to ${template.message}`;
  }
}