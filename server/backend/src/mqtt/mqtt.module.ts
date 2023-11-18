import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { ChatModule } from 'src/chat/chat.module';
import { MqttController } from './mqtt.controller';

@Module({
  imports:[ChatModule],
  providers: [MqttService],
  controllers: [MqttController]
})
export class MqttModule {}
