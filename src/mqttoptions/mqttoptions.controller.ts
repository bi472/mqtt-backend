import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { MqttOptionsDto } from './dto/base-options';
import { Request } from 'express';
import { UpdateMqttOptionsDto } from './dto/update-options';
import { MqttOptionsService } from './mqttoptions.service';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('mqttoptions')
@Controller('mqttoptions')
export class MqttOptionsController {
  constructor(private readonly mqttOptionsService: MqttOptionsService) {}

  @ApiOperation({ summary: 'Create mqtt options'})
  @ApiCreatedResponse({ description: 'Created mqttOptions object', type: MqttOptionsDto})
  @UseGuards(AccessTokenGuard)
  @Post() 
  async createMqttOption(
    @Req() req: Request,
    @Body() mqttOptionsDto: MqttOptionsDto
  ) {
    return await this.mqttOptionsService.createMqttOptions(mqttOptionsDto, req.user['sub'])
  }

  @ApiOperation({ summary: `Find all user's mqtt options`})
  @ApiOkResponse({ description: `All user's mqtt options`, type: Array })
  @UseGuards(AccessTokenGuard)
  @Get()
  async findMqttOptions(
    @Req() req: Request
  ) {
    return await this.mqttOptionsService.findUserMqttOptions(req.user['sub'])
  }

  @ApiOperation({ summary: `Edit mqtt options`})
  @ApiOkResponse({ description: `Edited mqtt options`, type: MqttOptionsDto })
  @ApiBody({ type: UpdateMqttOptionsDto})
  @ApiForbiddenResponse({ description: `If mqttOptionsID doesn't exist in user's mqtt options`})
  @UseGuards(AccessTokenGuard)
  @Post(':mqttOptionsID')
  async updateMqttOption(
    @Req() req: Request,
    @Param('mqttOptionsID') mqttOptionsID: string,
    @Body() body: UpdateMqttOptionsDto
  ) {
    return await this.mqttOptionsService.updateMqttOption(req.user['sub'], mqttOptionsID, body)
  }

  @ApiOperation({ summary: `Delete mqtt options`})
  @ApiOkResponse({ description: `Deleted mqtt options`, type: MqttOptionsDto })
  @ApiForbiddenResponse({ description: `If mqttOptionsID doesn't exists in user's mqtt options`})
  @UseGuards(AccessTokenGuard)
  @Delete(':mqttOptionsID')
  async deleteMqttOption(
    @Req() req: Request,
    @Param('mqttOptionsID') mqttOptionsID: string
  ) {
    return await this.mqttOptionsService.deleteMqttOption(req.user['sub'], mqttOptionsID)
  }
}
