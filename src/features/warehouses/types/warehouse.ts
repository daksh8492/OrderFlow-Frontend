export type WarehouseStatus =
    |"ACTIVE"
    |"INACTIVE"
    |"CLOSED"


export interface Warehouse {
  warehouseId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  status: WarehouseStatus;
  createdAt: string;
  locationIds: string[];
}
