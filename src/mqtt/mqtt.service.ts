import { Injectable, Logger} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { connect } from "mqtt";
import { TemplateDto } from 'src/templates/dto/base-template.dto';
import { UsersService } from 'src/users/users.service';
import { MqttOptionsDto } from './dto/base-options';
import { CreateMqttOptionsDto} from './dto/create-options';

import { MqttOptions, MqttOptionsDocument } from './schemas/mqttOptions.schema';

@Injectable()
export class MqttService{

  constructor(
    @InjectModel(MqttOptions.name) private mqttOptionsModel: Model<MqttOptionsDocument>,
    private readonly usersService: UsersService
  ) {}

  private readonly logger = new Logger(MqttService.name);
  private mqttClient;

  async findUserTemplatesByID(templateID: string, userID: string) : Promise<TemplateDto>{
    const template = await this.usersService.findUserTemplatesByID(userID, templateID)
    return template
  }

  async findUserMqttOptionsByID(mqttOptionsID: string, userID: string) : Promise<MqttOptionsDto> {
    const mqttOptions = await this.usersService.findUserMqttOptionsByID(userID, mqttOptionsID)
    console.log(mqttOptions)
    return mqttOptions
  }

  async findUserMqttOptions(userID: string): Promise<MqttOptionsDto[]> {
    const mqttOptions = await this.usersService.findUserMqttOptions(userID);
    return mqttOptions
  }

  async createMqttOptions(createMqttOptionsDto: CreateMqttOptionsDto, userID: string): Promise<MqttOptionsDto>{
    const createdMqttOptions = new this.mqttOptionsModel(createMqttOptionsDto)
    this.usersService.updateUserMqttOptions(userID, createdMqttOptions._id, )
    return createdMqttOptions.save()
  }


  async connect(mqttOptionsDto: MqttOptionsDto, callback:(connected: boolean) => void): Promise<void> {
    const host = (await mqttOptionsDto).host
    const port = (await mqttOptionsDto).port
    const username = (await mqttOptionsDto).username
    const password = (await mqttOptionsDto).password
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    console.log(username, password)

    const options = {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username,
      password,
      reconnectPeriod: 10000,
      rejectUnauthorized: false,
    }

    const connectUrl = `ws${(await mqttOptionsDto).sslConnection ? 's' : ''}://${host}:${port}`;

    this.mqttClient = connect(connectUrl, options);

    this.mqttClient.on("connect", async () => {
        callback(this.mqttClient.connected)

        this.logger.log(`Connected to MQTT server. clientID: <${clientId}> connectionUrl: ${connectUrl}`)

    });

    this.mqttClient.on("error",
        (error) => {
            callback(this.mqttClient.connected)
            this.logger.log(`MQTT client error: ${error}`);
            this.mqttClient.end()
    })
    .on("reconnect", () => {
      this.logger.log(`Reconnecting to MQTT server.`)
    })
    .on('close', () => {
      this.logger.log(`Closed connection to MQTT server. clientID: <${clientId}> connectionUrl: ${connectUrl}`)
    });
  }

  async disconnect() {
  }

  async subscribe(topic: string, callback: (message: string) => void): Promise<void> {
      this.mqttClient.subscribe(topic, (err) => {
        err ? this.logger.error(err): this.logger.log(`Subscribed to topic ${topic}`);
      });
  
      this.mqttClient.on('message', async (t, m) => {
        if (t === topic) {
          callback(m.toString());
        }
      });
  }
  
  async publish(topic: string, message: string): Promise<void> {
    this.mqttClient.publish(topic, message, (err) => {
      err ? this.logger.log(err) : this.logger.log(`Published message "${message}" to topic ${topic}`);
      });
  }
}
