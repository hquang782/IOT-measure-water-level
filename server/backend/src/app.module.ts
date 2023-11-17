import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { AddressModule } from './address/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/TypeOrm.config';

import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { MqttModule } from './mqtt/mqtt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ChatModule,
    AddressModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AccountModule,
    AuthModule,
    MqttModule,
  ],
})
export class AppModule {}
