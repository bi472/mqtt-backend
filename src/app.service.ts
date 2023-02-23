import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'It is API for communicate with IOT devices by protocol MQTT!';
  }
}
