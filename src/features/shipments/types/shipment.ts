export type ShipmentStatus = "DOCKING" | "IN_TRANSIT" | "DELIVERED";

export interface Shipment {
  shipmentId: string;
  shipmentNumber: string;
  cartonIds: string[];
  warehouseId: string;
  trackingNumber?: string;
  shipperId: string;
  status: ShipmentStatus;
  dispatchAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface AddShipmentDto {
  warehouseId: string;
  shipperId: string;
  trackingNumber?: string;
  cartonIds?: string[];
}
