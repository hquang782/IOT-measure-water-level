import { Controller, Post, Body } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @Post('publish')
  publishMessage(
    @Body() messageDto: { topic: string; payload: string },
  ): string {
    const { topic, payload } = messageDto;
    return this.mqttService.publish(topic, payload);
  }
}
