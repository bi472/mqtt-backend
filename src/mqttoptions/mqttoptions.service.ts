import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { MqttOptionsDto } from './dto/base-options';
import { CreateMqttOptionsDto } from './dto/create-options';
import { UpdateMqttOptionsDto } from './dto/update-options';
import { MqttOptions, MqttOptionsDocument } from './schemas/mqttOptions.schema';

@Injectable()
export class MqttOptionsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(MqttOptions.name) private mqttOptionsModel: Model<MqttOptionsDocument>
  ) {

  }

  async findUserMqttOptionsByID(mqttOptionsID: string, userID: string) : Promise<MqttOptionsDto> {
    const userData = (await this.usersService.findById(userID))
    const mqttOptionsIDx = userData.mqttOptions.findIndex(el => el.toString() === mqttOptionsID)
    if(mqttOptionsIDx === -1)
      throw new ForbiddenException('Forbidden')
    else
      return this.mqttOptionsModel.findOne({_id: mqttOptionsID}).exec()
  }

  async findUserMqttOptions(userID: string): Promise<MqttOptionsDto[]> {
    const userData = (await this.usersService.findById(userID)).populate('mqttOptions')
    return (await userData).mqttOptions
  }

  async createMqttOptions(createMqttOptionsDto: CreateMqttOptionsDto, userID: string): Promise<MqttOptionsDto>{
    const createdMqttOptions = new this.mqttOptionsModel(createMqttOptionsDto)
    this.usersService.push(userID, 'mqttOptions', createdMqttOptions._id)
    return createdMqttOptions.save()
  }

  async updateMqttOption(userID: string, mqttOptionsID: string, updateMqttOptionsDto: UpdateMqttOptionsDto): Promise<MqttOptionsDto> {
    const userData = (await this.usersService.findById(userID))
    const mqttOptionsIDx = userData.mqttOptions.findIndex(el => el.toString() === mqttOptionsID)
    if(mqttOptionsIDx === -1)
      throw new ForbiddenException('Forbidden')
    else
      return this.mqttOptionsModel.findOneAndUpdate(
        {_id: mqttOptionsID},
        updateMqttOptionsDto,
        {new: true}).exec()
  }

  async deleteMqttOption(userID: any, mqttOptionsID: string): Promise<MqttOptionsDto> {
    const userData = (await this.usersService.findById(userID))
    const mqttOptionsIDx = userData.mqttOptions.findIndex(el => el.toString() === mqttOptionsID)
    if(mqttOptionsIDx == -1)
      throw new ForbiddenException('Forbidden')
    else
      return this.mqttOptionsModel.findOneAndDelete( {_id: mqttOptionsID}).exec()
  }
}
