import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports:[AddressModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService,ChatGateway],
})
export class ChatModule {}
