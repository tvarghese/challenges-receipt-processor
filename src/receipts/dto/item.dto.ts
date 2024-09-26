import { IsString, Matches } from 'class-validator';
export class ItemDto {
    @IsString()
    @Matches(/^[\w\s\-]+$/)
    shortDescription: string;
  
    @IsString()
    @Matches(/^\d+\.\d{2}$/)
    price: string;
  }