import { Inject, Injectable } from '@nestjs/common';
import { AddressService } from 'src/address/address.service';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';

@Injectable()
export class ChatService {
  constructor(private addressService: AddressService) {}

  async saveData(data: deviceData): Promise<any> {
    const { name, high, lat, lng, status } = data;
    const address = await this.addressService.findOne(name);

    if (!address) {
      const createAddressDto: CreateAddressDto = {
        name,
        high,
        lat,
        lng,
        status,
      };
      const newAddress = await this.addressService.create(createAddressDto);
      console.log('create ' + newAddress.name);
    } else {
      const updateAddressDto: UpdateAddressDto = {
        name,
        high,
        lat,
        lng,
        status,
      };
      const lastAddress = await this.addressService.update(
        address.name,
        updateAddressDto,
      );
      console.log('update ' + lastAddress.name);
    }
  }
  async getData(name: string): Promise<any> {
    const address = await this.addressService.findOne(name);
    if (address) return address;
    else return null;
  }
}

interface deviceData {
  name: string;
  high: number;
  lat: number;
  lng: number;
  status: string;
}
