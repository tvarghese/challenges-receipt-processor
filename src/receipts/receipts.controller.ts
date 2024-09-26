// src/receipts/receipts.controller.ts

import { Controller, Post, Get, Param, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { ReceiptDto } from './dto/receipt.dto';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post('process')
  processReceipt(@Body() receiptDto: ReceiptDto) {
    try {
      const id = this.receiptsService.processReceipt(receiptDto);
      return { id };
    } catch (error) {
      throw new BadRequestException('Invalid receipt');
    }
  }

  @Get(':id/points')
  getPoints(@Param('id') id: string) {
    try {
      const points = this.receiptsService.getPoints(id);
      return { points };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid receipt ID');
    }
  }
}