import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { AddressModule } from './address/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/TypeOrm.config';

@Module({
  imports: [
    ChatModule,
    AddressModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
  ],
})
export class AppModule {}
