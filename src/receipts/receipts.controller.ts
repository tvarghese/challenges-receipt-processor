import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { Receipt } from './receipts.interface';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post('process')
  processReceipt(@Body() receipt: Receipt) {
    const id = this.receiptsService.processReceipt(receipt);
    return { id };
  }
  
  @Get(':id/points')
  getPoints(@Param('id') id: string) {
    const points = this.receiptsService.getPoints(id);
    return { points };
  }
}