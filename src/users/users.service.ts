import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMqttOptionsDto } from 'src/mqtt/dto/create-options';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUserMqttOptions(userID: string): Promise<MqttOptionsDto[]> {
    const userData = await this.userModel.findOne({id: userID}).populate('mqttOptions').exec()
    return userData.mqttOptions;
  }

  async findUserTemplates(userID: string): Promise<any>{
    const userData = await this.userModel.findOne({id: userID}).populate('templates').exec()
    return userData.templates;
  }

  async updateUserTemplates(id: string, templateID: string) {
    return await this.userModel
      .findOneAndUpdate(
        {id},
        {$push: {templates: templateID}},
        {new: true}
      )
      .exec()
  }

  async findByUsername(username: string): Promise<UserDocument>{
    return this.userModel.findOne({username}).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findOne({id}).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.userModel
      .findOneAndUpdate({id}, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findOneAndDelete({id}).exec();
  }
}