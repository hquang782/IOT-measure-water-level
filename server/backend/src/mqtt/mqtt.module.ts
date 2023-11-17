import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports:[ChatModule],
  providers: [MqttService]
})
export class MqttModule {}
