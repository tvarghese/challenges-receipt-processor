export interface Receipt {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: {
    shortDescription: string;
    price: string;
  }[];
  total: string;
}
