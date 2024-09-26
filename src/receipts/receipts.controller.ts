import { Controller, Post, Get, Param, Body, HttpException, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { Receipt } from './receipts.interface';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}
  private readonly logger = new Logger(ReceiptsController.name);

  @Post('process')
  processReceipt(@Body() receipt: Receipt) {
    const id = this.receiptsService.processReceipt(receipt);
    return { id };
  }

  @Get(':id/points')
  getPoints(@Param('id') id: string) {
    try {
      const points = this.receiptsService.getPoints(id);
      return { points };
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(`receipt with id : ${id} not found`);
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
}