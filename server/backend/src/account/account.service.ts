import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const newUser = this.accountRepository.create(createAccountDto);
    return await this.accountRepository.save(createAccountDto);
  }

  async findAll() {
    return await this.accountRepository.find();
  }

  async findOne(idOrUsename: string) {
    const user = await this.accountRepository.findOne({
      where: [{ id: idOrUsename }, { username: idOrUsename }],
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const updateUser = await this.accountRepository.findOne({ where: { id } });
    if (!updateUser) {
      throw new NotFoundException('User not found');
    }
    updateUser.username = updateAccountDto.username;
    updateUser.email = updateAccountDto.email;
    updateUser.password = updateAccountDto.password;
    return await this.accountRepository.save(updateUser);
  }

  async remove(id: string) {
    const user = await this.accountRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.id = id;
    return await this.accountRepository.remove(user);
  }
}
