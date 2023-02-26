import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from "mqtt";
import { debug, error, info } from "ps-logger";





@Injectable()
export class MqttService implements OnModuleInit{

    private mqttClient;

    onModuleInit() {
        const host = process.env.mqttHost
        const port = process.env.mqttPort
        const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

        const connectUrl = `mqtt://${host}:${port}`;

        this.mqttClient = connect(connectUrl, {
            clientId,
            clean: true,
            connectTimeout: 4000,
            username: process.env.mqttUser,
            password: process.env.mqttPass,
            reconnectPeriod: 1000,
        });

        this.mqttClient.on("connect", function () {
            info("Connected to CloudMQTT");
        });

        this.mqttClient.on("error",
            (error) => {
                console.error(`MQTT client error: ${error}`);
        });
    }

    subscribe(topic: string, callback: (message: string) => void): void {
        this.mqttClient.subscribe(topic, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Subscribed to topic ${topic}`);
          }
        });
    
        this.mqttClient.on('message', (t, m) => {
          if (t === topic) {
            callback(m.toString());
          }
        });
      }
    
      publish(topic: string, message: string): void {
        this.mqttClient.publish(topic, message, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`Published message "${message}" to topic ${topic}`);
          }
        });
      }
    }
