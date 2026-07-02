export const CUSTOMER_STATUS = ["ACTIVE", "INACTIVE", "CLOSED"] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUS)[number];

export interface Customer {
  customerId: string;
  customerCode: string;
  customerName: string;
  address: string;
  city: string;
  contactNumber: string;
  contactEmail: string;
  status: CustomerStatus;
  createdAt: string;
}