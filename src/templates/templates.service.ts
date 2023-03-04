import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Template, TemplateDocument } from './schemas/template.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
    private usersService: UsersService
  ) {}
  
  async create(createTemplateDto: CreateTemplateDto, userID: string): Promise<TemplateDocument> {
    const createdTemplate = new this.templateModel(createTemplateDto);
    this.usersService.updateUserTemplates(userID, createdTemplate.id)
    return createdTemplate.save();
  }

  async findUserTemplates(userID: string): Promise<TemplateDocument[]> {
    return await this.usersService.findUserTemplates(userID)
  }
}
