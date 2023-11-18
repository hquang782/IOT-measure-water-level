import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.addressService.findOne(name);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(name, updateAddressDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.addressService.remove(name);
  }
}
