import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

type PushColumn = {
  columnName: string,
  value: string
}

@Injectable()
export class UsersService {
  
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByUsername(username: string): Promise<UserDocument>{
    return this.userModel.findOne({username}).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findOne({_id: id}).exec();
  }

  async push(id: string, columnName: string,  value: string){
    this.userModel
      .findOneAndUpdate(
        {_id: id},
        {$push: {[columnName]: value}},
        {new: true}
      )
      .exec()
  }
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.userModel
      .findOneAndUpdate({_id: id}, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findOneAndDelete({_id: id}).exec();
  }
}