import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MqttOptionsDto } from './dto/base-options';
import { Request } from 'express';
import { UpdateMqttOptionsDto } from './dto/update-options';
import { MqttOptionsService } from './mqttoptions.service';

@Controller('mqttoptions')
export class MqttOptionsController {
  constructor(private readonly mqttOptionsService: MqttOptionsService) {}

  @UseGuards(AccessTokenGuard)
  @Post() 
  async createMqttOption(
    @Req() req: Request,
    @Body() mqttOptionsDto: MqttOptionsDto
  ) : Promise<any>{
    return await this.mqttOptionsService.createMqttOptions(mqttOptionsDto, req.user['sub'])
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findMqttOptions(
    @Req() req: Request
  ) : Promise<any>{
    return await this.mqttOptionsService.findUserMqttOptions(req.user['sub'])
  }

  @UseGuards(AccessTokenGuard)
  @Post(':mqttOptionsID')
  async updateMqttOption(
    @Req() req: Request,
    @Param('mqttOptionsID') mqttOptionsID: string,
    @Body() body: UpdateMqttOptionsDto
  ) : Promise<any>{
    return await this.mqttOptionsService.updateMqttOption(req.user['sub'], mqttOptionsID, body)
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':mqttOptionsID')
  async deleteMqttOption(
    @Req() req: Request,
    @Param('mqttOptionsID') mqttOptionsID: string
  ) : Promise<any>{
    return await this.mqttOptionsService.deleteMqttOption(req.user['sub'], mqttOptionsID)
  }
}
