import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Address {
  constructor() {
    this.id = uuidv4();
  }

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  @ApiProperty()
  name: string;

  @Column({ type: 'int', width: 10, nullable: false })
  @ApiProperty()
  high: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @ApiProperty()
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @ApiProperty()
  lng: number;
}
