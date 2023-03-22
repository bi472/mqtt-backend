import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template, TemplateDocument } from './schemas/template.schema';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private readonly templateModel: Model<TemplateDocument>,
    private readonly usersService: UsersService
  ) {}
  
  async create(createTemplateDto: CreateTemplateDto, userID: string): Promise<TemplateDocument> {
    const createdTemplate = new this.templateModel(createTemplateDto);
    return createdTemplate.save();
  }

  async update(updateTemplateDto: UpdateTemplateDto, userID: string, templateID: string): Promise<TemplateDocument> {
    const userData = (await this.usersService.findById(userID))
    const templateIDx = userData.templates.findIndex(el => el.toString() === templateID)
    if(templateIDx == -1)
      throw new ForbiddenException('Forbidden')
    else
      return this.templateModel.findOneAndUpdate(
        {_id: templateID},
        updateTemplateDto,
        {new: true}).exec()
  }

  async delete(userID: string, templateID: string): Promise<TemplateDocument>
  {
    const userData = (await this.usersService.findById(userID))
    const templateIDx = userData.templates.findIndex(el => el.toString() === templateID)
    if(templateIDx == -1)
      throw new ForbiddenException('Forbidden')
    else
      return this.templateModel.findOneAndDelete( {_id: templateID} ).exec()
  }

  async findAllUserTemplates(userID: string): Promise<any> {
    const userData = (await this.usersService.findById(userID)).populate('templates')
    return (await userData).templates
  }

  async findUserTemplateByID(userID: string, templateID: string): Promise<TemplateDocument> {
    const userData = (await this.usersService.findById(userID))
    const templateIDx = userData.templates.findIndex(el => el.toString() === templateID)
    if(templateIDx == -1)
      throw new ForbiddenException('Forbidden')
    else
      return this.templateModel.findOne( {_id: templateID} ).exec()
  }
}
