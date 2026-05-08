export type Category = 'FURNITURE' | 'APPLIANCES';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  monthlyRent: number;
  deposit: number;
  tenureOptions: number[];
  inventoryCount: number;
  imageUrl: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  tenureMonths: number;
};
