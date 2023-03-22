import { Injectable, Logger} from '@nestjs/common';
import { connect } from "mqtt";
import { MqttOptionsDto } from '../mqttoptions/dto/base-options';


@Injectable()
export class MqttService{

  constructor() {}

  private readonly logger = new Logger(MqttService.name);
  private mqttClient;

  async connect(mqttOptionsDto: MqttOptionsDto, callback:(connected: boolean) => void): Promise<any> {
    if (this.mqttClient?.connected !== undefined){
      console.log('popal')
      return false
    }
    
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
