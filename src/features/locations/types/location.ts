export type LocationType = "ZONE" | "ROW" | "RACK" | "BIN";

export const LOCATION_TYPE = ["ZONE", "ROW", "RACK", "BIN"];

export interface Location {
  locationId: string;
  locationType: LocationType;
  warehouseId: string;
  code: string;
  parentLocationId: string;
  locationName: string;
  active: boolean;
}
