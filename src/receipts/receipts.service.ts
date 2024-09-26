import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Receipt } from './receipts.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReceiptsService {
  private readonly logger = new Logger(ReceiptsService.name);
  private receipts: Map<string, Receipt> = new Map();
  private points: Map<string, number> = new Map();

  getPoints(id: string): number {
    if (!this.points.has(id)) {
      throw new NotFoundException(`Receipt with ID ${id} not found`);
    }
    return this.points.get(id);
  }

  processReceipt(receipt: Receipt): string {
    const id = uuidv4();
    this.receipts.set(id, receipt);
    const calculatedPoints = this.calculatePoints(receipt);
    this.points.set(id, calculatedPoints);
    this.logger.debug(`Processed receipt: ${id}`);
    return id;
  }

  private calculatePoints(receipt: Receipt): number {
    let points = 0;

    // Rule 1: One point for every alphanumeric character in the retailer name
    points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;

    // Rule 2: 50 points if the total is a round dollar amount with no cents
    if (Number.isInteger(parseFloat(receipt.total))) {
      points += 50;
    }

    // Rule 3: 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total) % 0.25 === 0) {
      points += 25;
    }

    // Rule 4: 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;

    // Rule 5: If the trimmed length of the item description is a multiple of 3,
    // multiply the price by 0.2 and round up to the nearest integer
    receipt.items.forEach((item) => {
      const trimmedLength = item.shortDescription.trim().length;
      if (trimmedLength % 3 === 0) {
        points += Math.ceil(parseFloat(item.price) * 0.2);
      }
    });

    // Rule 6: 6 points if the day in the purchase date is odd
    const purchaseDate = new Date(receipt.purchaseDate);
    if (purchaseDate.getDate() % 2 !== 0) {
      points += 6;
    }

    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const [hours, minutes] = receipt.purchaseTime.split(':').map(Number);
    if ((hours === 14 && minutes > 0) || (hours === 15)) {
      points += 10;
    }

    return points;
  }
}