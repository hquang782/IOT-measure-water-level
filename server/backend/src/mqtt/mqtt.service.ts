import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { error, info } from 'ps-logger';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class MqttService implements OnModuleInit {
  private mqttClient: MqttClient;
  constructor(private webGateway: ChatGateway) {}
  onModuleInit() {
    // const host = this.configService.get<string>('c715fb1b256c4e3f95b25d58503a71b6.s2.eu.hivemq.cloud')
    // const port = this.configService.get<string>('8884')
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    const connectUrl = `ws://broker.hivemq.com:8000/mqtt`;
    // const connectUrl = `mqtt://${host}:${port}`;

    this.mqttClient = connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 40000,
      keepalive: 60,
      protocolId: 'MQTT',
      protocolVersion: 4,
      reconnectPeriod: 1000,
    });

    this.mqttClient.on('connect', function () {
      info('Connected to CloudMQTT');
    });

    this.mqttClient.on('error', function () {
      error('Error in connecting to CloudMQTT');
    });

    this.mqttClient.subscribe('/WL_QP/p/water_level');
    this.mqttClient.on('message', (topic, payload) => {
      info(`Received message from ${topic}: ${payload}`);
      try {
        const messageJson = JSON.parse(payload.toString());
        // `messageJson` là một đối tượng JSON hợp lệ
        this.webGateway.handleIotData(messageJson);
      } catch (error) {
        // Xử lý lỗi nếu chuỗi không phải là JSON hợp lệ
        console.error(`Error parsing JSON: ${error}`);
        console.log(`Original payload: ${payload}`);
      }
    });
  }

  publish(topic: string, payload: string): string {
    info(`Publishing to ${topic}`);
    this.mqttClient.publish(topic, payload);
    return `Publishing to ${topic}`;
  }
}
