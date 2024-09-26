import { Test, TestingModule } from "@nestjs/testing";
import { ReceiptsService } from "./receipts.service";
import { NotFoundException } from "@nestjs/common";
import { Receipt } from "./receipts.interface";

describe("ReceiptsService", () => {
  let service: ReceiptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptsService],
    }).compile();

    service = module.get<ReceiptsService>(ReceiptsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getPoints", () => {
    it("should return points for a valid receipt ID", () => {
      const receiptId = service.processReceipt({
        retailer: "Test",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [],
        total: "0.00",
      });
      expect(service.getPoints(receiptId)).toBe(10); // 4 points for 'Test' + 6 for odd date
    });

    it("should throw NotFoundException for non-existent receipt ID", () => {
      expect(() => service.getPoints("non-existent-id")).toThrow(
        NotFoundException,
      );
    });
  });

  describe("processReceipt", () => {
    it("should return a UUID", () => {
      const receipt: Receipt = {
        retailer: "Test",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [],
        total: "0.00",
      };
      const result = service.processReceipt(receipt);
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe("calculatePoints", () => {
    it("should calculate points correctly for retailer name", () => {
      const receipt: Receipt = {
        retailer: "Test & Shop",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [],
        total: "0.00",
      };
      const result = service.processReceipt(receipt);
      expect(service.getPoints(result)).toBe(14); // 8 alphanumeric characters + 6 for odd date
    });

    it("should award 50 points for round dollar amounts", () => {
      const receipt: Receipt = {
        retailer: "Test",
        purchaseDate: "2022-01-02", // Even day
        purchaseTime: "13:01",
        items: [],
        total: "100.00",
      };
      const result = service.processReceipt(receipt);
      expect(service.getPoints(result)).toBe(79); // 4 for name + 50 for round amount + 25 for multiple of 0.25
    });

    it("should award 25 points for totals that are multiples of 0.25", () => {
      const receipt: Receipt = {
        retailer: "Test",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [],
        total: "10.75",
      };
      const result = service.processReceipt(receipt);
      expect(service.getPoints(result)).toBe(35); // 4 for name + 25 for multiple of 0.25 + 6 for odd date
    });

    it("should award points correctly for number of items", () => {
      const receipt: Receipt = {
        retailer: "Test",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [
          { shortDescription: "Item 1", price: "1.00" },
          { shortDescription: "Item 2", price: "2.00" },
          { shortDescription: "Item 3", price: "3.00" },
        ],
        total: "6.00",
      };
      const result = service.processReceipt(receipt);
      expect(service.getPoints(result)).toBe(93); // 4 for name + 50 for round amount + 25 for multiple of 0.25 + 5 for items + 3 for description length + 6 for odd date
    });

    it("should award points correctly for item description length", () => {
      const receipt: Receipt = {
        retailer: "Test",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [{ shortDescription: "Item 123", price: "10.00" }],
        total: "10.00",
      };
      const result = service.processReceipt(receipt);
      expect(service.getPoints(result)).toBe(85); // 4 for name + 50 for round amount + 25 for multiple of 0.25 + 2 for item description + 6 for odd date
    });

    it("should award 6 points for odd purchase dates", () => {
      const receipt: Receipt = {
        retailer: "Test",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [],
        total: "0.00",
      };
      const result = service.processReceipt(receipt);
      expect(service.getPoints(result)).toBe(10); // 4 for name + 6 for odd date
    });

    it("should award 10 points for purchase times between 2:00pm and 4:00pm", () => {
      const receipt: Receipt = {
        retailer: "Test",
        purchaseDate: "2022-01-01",
        purchaseTime: "14:01",
        items: [],
        total: "0.00",
      };
      const result = service.processReceipt(receipt);
      expect(service.getPoints(result)).toBe(20); // 4 for name + 6 for odd date + 10 for time
    });

    it("should calculate points correctly for the given payload - example 1", () => {
      const receipt: Receipt = {
        retailer: "Target",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        items: [
          {
            shortDescription: "Mountain Dew 12PK",
            price: "6.49",
          },
          {
            shortDescription: "Emils Cheese Pizza",
            price: "12.25",
          },
          {
            shortDescription: "Knorr Creamy Chicken",
            price: "1.26",
          },
          {
            shortDescription: "Doritos Nacho Cheese",
            price: "3.35",
          },
          {
            shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
            price: "12.00",
          },
        ],
        total: "35.35",
      };

      const result = service.processReceipt(receipt);
      const points = service.getPoints(result);

      expect(points).toBe(28);
    });

    it("should calculate all rules correctly - example 2", () => {
      const receipt: Receipt = {
        retailer: "M&M Corner Market",
        purchaseDate: "2022-03-20",
        purchaseTime: "14:33",
        items: [
          { shortDescription: "Gatorade", price: "2.25" },
          { shortDescription: "Gatorade", price: "2.25" },
          { shortDescription: "Gatorade", price: "2.25" },
          { shortDescription: "Gatorade", price: "2.25" },
        ],
        total: "9.00",
      };
      const result = service.processReceipt(receipt);
      expect(service.getPoints(result)).toBe(109);
    });
  });
});
