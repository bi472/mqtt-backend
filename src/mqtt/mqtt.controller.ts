import { MqttService } from './mqtt.service';
import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
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
  ): Promise<string>{
    let responseMessage;
    if (this.mqttService.checkConnection()) {
      responseMessage = `You are already connected.`
      return JSON.stringify({ responseMessage })
    }
    const promise =  new Promise<string>(
      async (resolve, reject) => {
        setTimeout(() => {
          responseMessage = `The waiting time has expired.`
          resolve(JSON.stringify({ responseMessage }))
        }, 20000)
        const mqttOptionsDto = await this.mqttOptionsService.findUserMqttOptionsByID(body.mqttOptionsID, req.user['sub'])
        const {connected, errorMessage} = await this.mqttService.connect(mqttOptionsDto ? mqttOptionsDto : body.mqttOptionsDto)
        connected ? responseMessage = 'You are successfully connected!' :  responseMessage = `Error: ${errorMessage.message}`
        resolve(JSON.stringify(responseMessage))
      }
    )
    return promise
  }

  @UseGuards(AccessTokenGuard)
  @Get('disconnect')
  async disconnect(): Promise<string>{
    let responseMessage;
    if (!this.mqttService.checkConnection()){
      responseMessage = 'You are already connected'
      return JSON.stringify([responseMessage])
    }
    await this.mqttService.disconnect()
    return `Connection status: ${this.mqttService.checkConnection()}`
  }



  @UseGuards(AccessTokenGuard)
  @Get('/subscribe')
  async subscribe(
    @Req() req: Request,
    @Body() body: { templateID: string},
  ): Promise<string> {
    let responseMessage;
    if (!this.mqttService.checkConnection()){
      responseMessage = 'You are already connected'
      return JSON.stringify([responseMessage])
    }
    const template = await this.templatesService.findUserTemplateByID(req.user['sub'], body.templateID)
    const promise = new Promise<string>(
      async (resolve, reject) => {
        setTimeout(() => {
          responseMessage = `You are haven't recieved any message. The waiting time has expired.`
          resolve(JSON.stringify({responseMessage}))
        }, 100000)
        resolve(this.mqttService.subscribe(template.topic))
    })

    promise.then(() => this.mqttService.unsubscribe(template.topic))
    return promise
  }
  
  @UseGuards(AccessTokenGuard)
  @Get('/publish')
  async publish(
    @Req() req: Request,
    @Body() body: { templateID: string},
  ): Promise<string> {
    let responseMessage;
    if (!this.mqttService.checkConnection()){
      responseMessage = 'You are already connected'
      return JSON.stringify({responseMessage})
    }
    setTimeout(() => {
      responseMessage = `The waiting time has expired`
      return(JSON.stringify({responseMessage}))
    }, 10000)
    const template = await this.templatesService.findUserTemplateByID(req.user['sub'], body.templateID)
    await this.mqttService.publish(template.topic,template.message);
    responseMessage = `Published ${template.topic} to ${template.message}`
    return JSON.stringify({responseMessage});
  }
}