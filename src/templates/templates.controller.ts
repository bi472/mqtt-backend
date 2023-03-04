import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Request } from 'express';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @UseGuards(RefreshTokenGuard)
  @Post()
  create(
    @Body() createTemplateDto: CreateTemplateDto,
    @Req() req: Request
  ) {
    return this.templatesService.create(createTemplateDto, req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get()
  findUsersTemplates(@Req() req: Request){
    return this.templatesService.findUserTemplates(req.user['sub'])
  }
}
