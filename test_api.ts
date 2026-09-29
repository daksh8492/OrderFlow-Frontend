import { getRootLocations } from "./src/features/locations/api/locationApi";
import { getWarehouses } from "./src/features/warehouses/api/warehouseApi";

async function test() {
  try {
    const ws = await getWarehouses(0, 10);
    const wId = ws.content[0].warehouseId;
    console.log("Warehouse:", wId);
    const roots = await getRootLocations(wId);
    console.log("Roots:", roots.map(r => ({id: r.locationId, name: r.locationName, type: r.locationType, parent: r.parentLocationId})));
  } catch(e) {
    console.error(e);
  }
}
test();
