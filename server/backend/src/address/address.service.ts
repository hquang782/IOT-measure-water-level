import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto) {
    const newAddress = this.addressRepository.create(createAddressDto);
    return await this.addressRepository.save(createAddressDto);
  }

  async findAll() {
    return await this.addressRepository.find();
  }

  async findOne(name: string) {
    const address = await this.addressRepository.findOne({
      where: {
        name: name,
      },
    });
    if (!address) {
      return null;
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const updateAddress = await this.addressRepository.findOne({
      where: { id },
    });
    if (!updateAddress) {
      throw new NotFoundException('Address not found');
    }
    updateAddress.name = updateAddressDto.name;
    updateAddress.high = updateAddressDto.high;
    return await this.addressRepository.save(updateAddress);
  }

  async remove(name: string) {
    const address = await this.addressRepository.findOne({ where: { name } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return await this.addressRepository.remove(address);
  }
}
