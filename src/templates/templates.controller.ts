import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Request } from 'express';
import { CreateTemplateDto } from './dto/create-template.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @Req() req: Request
  ) {
    return await this.templatesService.create(createTemplateDto, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':templateID')
  async update(
    @Param('templateID') templateID: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @Req() req: Request
  ): Promise<UpdateTemplateDto>{
    return await this.templatesService.update(updateTemplateDto, req.user['sub'], templateID)
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Req() req: Request){
    return await this.templatesService.findUserTemplates(req.user['sub'])
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':templateID')
  async delete(
    @Req() req: Request, 
    @Param('templateID') templateID: string
  ){
    return await this.templatesService.delete(req.user['sub'], templateID)
  } 
}
