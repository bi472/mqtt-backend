import { Injectable, Logger} from '@nestjs/common';
import { connect } from "mqtt";
import { MqttOptionsDto} from './dto/options';





@Injectable()
export class MqttService{

    private readonly logger = new Logger(MqttService.name);
    private mqttClient;

    async connect(mqttOptionsDto: MqttOptionsDto, callback:(connected: boolean) => void): Promise<void> {
      const host = mqttOptionsDto.host
      const port = mqttOptionsDto.port
      const username = mqttOptionsDto.username
      const password = mqttOptionsDto.password
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

      const connectUrl = `ws${mqttOptionsDto.sslConnection ? 's' : ''}://${host}:${port}`;

      this.mqttClient = connect(connectUrl, options);

      this.mqttClient.on("connect", async () => {
          callback(this.mqttClient.connected)
          console.log(`Connected to MQTT server. clientID: <${clientId}> connectionUrl: ${connectUrl}`)

      });

      this.mqttClient.on("error",
          (error) => {
              callback(this.mqttClient.connected)
              console.log(`MQTT client error: ${error}`);
      })
      .on("reconnect", () => {
          console.log(`Reconnecting to MQTT server.`)
      });
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
    
      publish(topic: string, message: string): void {
        this.mqttClient.publish(topic, message, (err) => {
          err ? this.logger.log(err) : this.logger.log(`Published message "${message}" to topic ${topic}`);
          });
      }
    }
