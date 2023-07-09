import { MqttService } from './mqtt.service';
import { BadRequestException, Body, Controller, Get, Logger, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { MqttOptionsDto } from '../mqttoptions/dto/base-options'
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MqttOptionsService } from 'src/mqttoptions/mqttoptions.service';
import { TemplatesService } from 'src/templates/templates.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiOkResponse, ApiBody, ApiBadRequestResponse, ApiParam, ApiCookieAuth } from '@nestjs/swagger';
import { ResponseMessageDto } from './dto/response-message';
import { MqttOptionsSchema } from 'src/mqttoptions/schemas/mqttOptions.schema';

@ApiTags('mqtt')
@ApiBearerAuth()
@ApiCookieAuth()
@Controller('mqtt')
export class MqttController {

  private logger = new Logger(MqttController.name);

  constructor(
    private readonly mqttService: MqttService,
    private readonly mqttOptionsService: MqttOptionsService,
    private readonly templatesService: TemplatesService
  ) {}

  @ApiOperation({ summary: 'Connect to MQTT broker'})
  @ApiOkResponse({ description: 'JSON message about successfull connect', type: ResponseMessageDto })
  @ApiBadRequestResponse({ description: 'JSON message with error', type: ResponseMessageDto})
  @UseGuards(AccessTokenGuard)
  @Get('connect/:mqttOptionsID')
  async connect(
    @Req() req: Request,
    @Param('mqttOptionsID') mqttOptionsID: string,
    @Res({ passthrough: true }) res: Response
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
        const mqttOptionsDto = await this.mqttOptionsService.findUserMqttOptionsByID(mqttOptionsID, req.user['sub'])
        const {connected, errorMessage} = await this.mqttService.connect(mqttOptionsDto)
        if (connected) 
          responseMessage = 'You are successfully connected!'
        else{
          responseMessage = `Error: ${errorMessage.message}`
          res.status(400)
          resolve(responseMessage)
        }
        resolve(JSON.stringify(responseMessage))
      }
    )
    return promise
  }

  @ApiOperation({ summary: 'Disconnect current client from MQTT broker' })
  @ApiOkResponse({ description: 'Returns connection status' })
  @UseGuards(AccessTokenGuard)
  @Get('disconnect')
  async disconnect(): Promise<string>{
    let responseMessage;
    if (!this.mqttService.checkConnection()){
      responseMessage = 'You are not connected connected'
      return JSON.stringify([responseMessage])
    }
    await this.mqttService.disconnect()
    responseMessage = `Connection status: ${this.mqttService.checkConnection()}`
    return `Connection status: ${this.mqttService.checkConnection()}`
  }


  @ApiOperation({ summary: 'Subscribe to topic', description: 'Return once message from subscription topic, then unsubscribe. Timeout: 100 seconds' })
  @ApiOkResponse({ description: 'JSON message with received message', type: ResponseMessageDto })
  @ApiBadRequestResponse({ description: 'JSON message that timeout was expired or client is not connected.', type: ResponseMessageDto})
  @UseGuards(AccessTokenGuard)
  @Get('/subscribe/:templateID')
  async subscribe(
    @Req() req: Request,
    @Param('templateID') templateID: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<string> {
    let responseMessage;
    if (!this.mqttService.checkConnection()){
      responseMessage = 'You are already connected'
      res.status(400)
      return JSON.stringify([responseMessage])
    }
    const template = await this.templatesService.findUserTemplateByID(req.user['sub'], templateID)
    const promise = new Promise<string>(
      async (resolve, reject) => {
        setTimeout(() => {
          responseMessage = `You are haven't recieved any message. The waiting time has expired.`
          res.status(400)
          resolve(JSON.stringify({responseMessage}))
        }, 100000)
        resolve(this.mqttService.subscribe(template.topic))
    })

    promise.then(() => this.mqttService.unsubscribe(template.topic))
    return promise
  }
  
  @ApiOperation({ summary: 'Publish to topic', description: 'Publish message to topic. Timeout: 10 seconds' })
  @ApiOkResponse({ description: 'JSON message with message and topic', type: ResponseMessageDto })
  @ApiBadRequestResponse({ description: 'JSON message that timeout was expired or client is not connected.', type: ResponseMessageDto})
  @UseGuards(AccessTokenGuard)
  @Get('/publish/:templateID')
  async publish(
    @Req() req: Request,
    @Param('templateID') templateID: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<string> {
    let responseMessage;
    if (!this.mqttService.checkConnection()){
      responseMessage = 'You are already connected'
      res.status(400)
      return JSON.stringify({responseMessage})
    }
    setTimeout(() => {
      res.status(400)
      responseMessage = `The waiting time has expired`
      return(JSON.stringify({responseMessage}))
    }, 10000)
    const template = await this.templatesService.findUserTemplateByID(req.user['sub'], templateID)
    await this.mqttService.publish(template.topic,template.message);
    responseMessage = `Published ${template.topic} to ${template.message}`
    return JSON.stringify({responseMessage});
  }
}