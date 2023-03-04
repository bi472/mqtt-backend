import { PartialType } from '@nestjs/mapped-types';
import { CreateMqttOptionsDto } from './create-options';

export class UpdateMqttOptionsDto extends PartialType(CreateMqttOptionsDto) {}
