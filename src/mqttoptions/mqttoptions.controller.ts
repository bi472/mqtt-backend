import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MqttOptionsDto } from './dto/base-options';
import { Request } from 'express';
import { UpdateMqttOptionsDto } from './dto/update-options';
import { MqttoptionsService } from './mqttoptions.service';

@Controller('mqttoptions')
export class MqttoptionsController {
  constructor(private readonly mqttoptionsService: MqttoptionsService) {}

  @UseGuards(AccessTokenGuard)
  @Post() 
  async createMqttOption(
    @Req() req: Request,
    @Body() mqttOptionsDto: MqttOptionsDto
  ) : Promise<any>{
    return await this.mqttoptionsService.createMqttOptions(mqttOptionsDto, req.user['sub'])
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findMqttOptions(
    @Req() req: Request
  ) : Promise<any>{
    return await this.mqttoptionsService.findUserMqttOptions(req.user['sub'])
  }

  @UseGuards(AccessTokenGuard)
  @Post(':mqttOptionsID')
  async updateMqttOption(
    @Req() req: Request,
    @Param('mqttOptionsID') mqttOptionsID: string,
    @Body() body: UpdateMqttOptionsDto
  ) : Promise<any>{
    return await this.mqttoptionsService.updateMqttOption(req.user['sub'], mqttOptionsID, body)
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':mqttOptionsID')
  async deleteMqttOption(
    @Req() req: Request,
    @Param('mqttOptionsID') mqttOptionsID: string
  ) : Promise<any>{
    return await this.mqttoptionsService.deleteMqttOption(req.user['sub'], mqttOptionsID)
  }
}
