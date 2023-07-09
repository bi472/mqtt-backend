import { Injectable, Logger} from '@nestjs/common';
import { connect } from "mqtt";
import { resolve } from 'path';
import { MqttOptionsDto } from '../mqttoptions/dto/base-options';

interface ConnectionMessage{
  connected: boolean,
  errorMessage?: Error
}

@Injectable()
export class MqttService{

  constructor() {}

  private readonly logger = new Logger(MqttService.name);
  private mqttClient;

  checkConnection(){
    console.log(this.mqttClient?.connected)
    return this.mqttClient?.connected !== undefined && this.mqttClient?.connected === true
  }

  async connect(mqttOptionsDto: MqttOptionsDto): Promise<ConnectionMessage>{
    const host = (await mqttOptionsDto).host
    const port = (await mqttOptionsDto).port
    const username = (await mqttOptionsDto).username
    const password = (await mqttOptionsDto).password
    const sslConnection = (await mqttOptionsDto).sslConnection
    const connectionType = (await mqttOptionsDto).connectionType
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    const options = {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username,
      password,
      reconnectPeriod: 10000,
      rejectUnauthorized: false,
    }

    const connectUrl = `${connectionType ?? 'mqtt'}${sslConnection ? 's' : ''}://${host}:${port}`;

    this.mqttClient = connect(connectUrl, options);

    return new Promise<ConnectionMessage>(
      (resolve, reject) => {
      this.mqttClient.on("connect", () => {
        resolve({connected: this.mqttClient.connected})
        this.logger.log(`Connected to MQTT server. clientID: <${clientId}> connectionUrl: ${connectUrl}`)
      });

      this.mqttClient.on("error",
        (error) => {
          resolve({connected: this.mqttClient.connected, errorMessage: error})
          this.logger.log(`MQTT client: ${error}`);
          this.mqttClient.end()
      })
      .on("reconnect", () => {
        this.logger.log(`Reconnecting to MQTT server.`)
      })
      .on('close', () => {
        this.logger.log(`Closed connection to MQTT server. clientID: <${clientId}> connectionUrl: ${connectUrl}`)
      });
    }
    )
  }

  async disconnect(): Promise<boolean>{
    this.mqttClient?.end()
    return new Promise<boolean>((resolve, reject) => this.mqttClient.on('close', () => {resolve(true)}))
  }

  async unsubscribe(topic: string) {
    this.mqttClient?.unsubscribe(topic)
    this.logger.log(`Unsunscribed from ${topic}.`)
  }

  async subscribe(topic: string) : Promise<string>{
      this.mqttClient?.subscribe(topic, (err) => {
        err ? this.logger.error(err): this.logger.log(`Subscribed to topic ${topic}`);
      });

      return new Promise<string>(
        (resolve, reject) => 
        this.mqttClient?.on('message', async (t, m) => {
          if(t === topic) resolve(m.toString())
        }
      ))
  }
  
  async publish(topic: string, message: string){
    this.mqttClient?.publish(topic, message, (err) => {
      err ? this.logger.log(err) : this.logger.log(`Published message "${message}" to topic ${topic}`);
      });
  }
}
