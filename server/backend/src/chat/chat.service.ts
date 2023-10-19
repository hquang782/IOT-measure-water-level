import { Inject, Injectable } from '@nestjs/common';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';

@Injectable()
export class ChatService {
  constructor(private addressService: AddressService) {}

  async saveData(
    name: string,
    high: number,
    lat: number,
    lng: number,
  ): Promise<any> {
    const address = await this.addressService.findOne(name);

    if (!address) {
      const createAddressDto: CreateAddressDto = {
        name,
        high,
        lat,
        lng,
      };
      const newAddress = await this.addressService.create(createAddressDto);
      console.log(newAddress);
    } else {
      const updateAddressDto: UpdateAddressDto = {
        name,
        high,
        lat,
        lng,
      };
      const lastAddress = await this.addressService.update(
        address.id,
        updateAddressDto,
      );
      console.log(lastAddress);
    }
  }
}
