import { PartialType } from '@nestjs/mapped-types';
import { MqttOptionsDto } from './base-options';

export class CreateMqttOptionsDto extends PartialType(MqttOptionsDto) {}
