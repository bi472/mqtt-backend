import { PartialType } from '@nestjs/mapped-types';
import { TemplateDto } from './base-template.dto';

export class CreateTemplateDto extends PartialType(TemplateDto) {}