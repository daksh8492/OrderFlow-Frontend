export type CartonStatus = "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface CartonItem {
  cartonItemId: string;
  cartonId: string;
  orderItemId: string;
  packedQuantity: number;
  createdAt: string;
}

export interface Carton {
  cartonId: string;
  cartonNumber: string;
  orderId: string;
  packerId: string;
  warehouseId: string;
  weight: number;
  pickingId: string;
  cartonItems: CartonItem[];
  status: CartonStatus;
  createdAt: string;
}

export interface AddCartonDto {
  orderId: string;
  packerId: string;
  warehouseId: string;
  weight: number;
  pickingId: string;
  cartonItems: {
    orderItemId: string;
    packedQuantity: number;
  }[];
}
