import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class ItemDto {
  @ApiProperty({ example: 'Chainsaw Man Vol. 1' })
  @IsString()
  title: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 10990 })
  @Type(() => Number)
  @IsNumber()
  unit_price: number;
}

export class CreatePreferenceDto {
  @ApiProperty({ example: 'order-001' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 'Jhony Developer' })
  @IsString()
  name: string;

  @ApiProperty({ type: [ItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  @IsNotEmpty()
  items: ItemDto[];
}
