import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Address } from 'src/address/entities/address.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Address,Account],
      synchronize: true,
    };
  }
}
  