export type FieldOfWork =
  | "ADMIN"
  | "INVENTORY_MANAGER"
  | "WAREHOUSE_OPERATOR"
  | "DRIVER";

export const FIELD_OF_WORK = [
  "ADMIN",
  "INVENTORY_MANAGER",
  "WAREHOUSE_OPERATOR",
  "DRIVER",
];

export interface User {
  userId: string;
  name: string;
  code: string;
  fieldOfWork: FieldOfWork;
  warehouseId: string;
  address: string | null;
  city: string | null;
  contactNumber: string | null;
  contactTelephone: string | null;
  contactEmail: string | null;
  salary: number | null;
  active: boolean;
  joinedAt: string | null;
}
