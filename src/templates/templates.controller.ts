import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Request } from 'express';
import { CreateTemplateDto } from './dto/create-template.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TemplateDto } from './dto/base-template.dto';

@ApiBearerAuth()
@ApiCookieAuth()
@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @ApiOperation({ summary: 'Create template'})
  @ApiCreatedResponse({ description: 'Created template object', type: TemplateDto})
  @UseGuards(AccessTokenGuard)
  @Post()
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @Req() req: Request
  ) {
    return await this.templatesService.create(createTemplateDto, req.user['sub']);
  }

  @ApiOperation({ summary: `Edit template`})
  @ApiOkResponse({ description: `Edited template`, type: TemplateDto })
  @ApiForbiddenResponse({ description: `If templateID doesn't exist in user's templates`})
  @ApiBody({ type: TemplateDto})
  @UseGuards(AccessTokenGuard)
  @Post(':templateID')
  async update(
    @Param('templateID') templateID: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @Req() req: Request
  ): Promise<UpdateTemplateDto>{
    return await this.templatesService.update(updateTemplateDto, req.user['sub'], templateID)
  }

  @ApiOperation({ summary: `Find all user's templates`})
  @ApiOkResponse({ description: `All user's templates`, type: TemplateDto })
  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Req() req: Request){
    return await this.templatesService.findAllUserTemplates(req.user['sub'])
  }

  @ApiOperation({ summary: `Delete template`})
  @ApiOkResponse({ description: `Deleted template`, type: TemplateDto })
  @ApiForbiddenResponse({ description: `If templateID doesn't exist in user's templates`})
  @UseGuards(AccessTokenGuard)
  @Delete(':templateID')
  async delete(
    @Req() req: Request, 
    @Param('templateID') templateID: string
  ){
    return await this.templatesService.delete(req.user['sub'], templateID)
  } 
}
