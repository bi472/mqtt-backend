import { MqttService } from './mqtt.service';
import { Body, Controller, Get, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MqttOptionsDto } from './dto/create-options'
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UsersService } from 'src/users/users.service';
import { MqttOptions } from './schemas/mqttOptions.schema';

@Controller('mqtt')
export class MqttController {

  private logger= new Logger(MqttController.name);

  constructor(
    private readonly mqttService: MqttService,
    private readonly userService: UsersService
    ) {}

  @UseGuards(AccessTokenGuard)
  @Get('connect')
  async connect(
    @Body() mqttOptionsDto: Promise<MqttOptionsDto>,
    @Req() req: Request
  ): Promise<boolean>{
    return new Promise(
      (resolve, reject) => {
        this.mqttService.connect(mqttOptionsDto, 
          (connected: boolean) => { resolve(connected) })
      }
    )
  }

  @UseGuards(AccessTokenGuard)
  @Post('mqttoptions')
  async createMqttOptions(
    @Req() req: Request,
    @Body() body: MqttOptionsDto
  ) : Promise<any>{
    
  }

  @UseGuards(AccessTokenGuard)
  @Get('connect/:mqttOptionsID')
  async connectBySavedOptions(
    @Req() req: Request,
    @Param() mqttOptionsID: string,
  ): Promise<boolean>{
    return new Promise(
      (resolve, reject) => {
        const mqttOptionsDto = this.userService.findUserMqttOptions(req.user['sub'])
        
      }
    )
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