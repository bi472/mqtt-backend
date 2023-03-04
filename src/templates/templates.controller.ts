import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Request } from 'express';
import { CreateTemplateDto } from './dto/create-template.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @Body() createTemplateDto: CreateTemplateDto,
    @Req() req: Request
  ) {
    return this.templatesService.create(createTemplateDto, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findUsersTemplates(@Req() req: Request){
    return this.templatesService.findUserTemplates(req.user['sub'])
  }
}
