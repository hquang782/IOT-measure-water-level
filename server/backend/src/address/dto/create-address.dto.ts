import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  high: number;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;
}
