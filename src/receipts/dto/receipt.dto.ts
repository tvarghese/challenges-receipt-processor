import { Type } from 'class-transformer';
import { IsString, Matches, IsArray, ValidateNested, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { ItemDto } from './item.dto';
export class ReceiptDto {
  @IsString()
  @Matches(/^[\w\s\-&]+$/)
  retailer: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  purchaseDate: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  purchaseTime: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsString()
  @Matches(/^\d+\.\d{2}$/)
  total: string;
}