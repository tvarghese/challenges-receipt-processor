import { Injectable } from '@nestjs/common';
import { Receipt } from './receipts.interface';

@Injectable()
export class ReceiptsService {
  private receipts: Map<string, Receipt> = new Map();
  private points: Map<string, number> = new Map();

  getPoints(id: string): number {
    return this.points.get(id) || 0;
  }

}