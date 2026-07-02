import { useEffect, useState } from "react";
import { addVendor, deleteVendor, getVendors, updateVendor } from "../api/vendorApi";
import type { PageResponse } from "@/types/pageResponse";
import { VENDOR_STATUS, type Vendor, type VendorStatus } from "../types/vendor";
import VendorTable from "../components/VendorTable";
import type { VendorFormData } from "../schema/vendorSchema";
import TableToolbar from "@/components/common/TableToolbar";
import AddVendorDialog from "../components/AddVendorDialog";

function VendorsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<VendorStatus>();
  const [vendorsPage, setVendorsPage] = useState<PageResponse<Vendor>>();

  const fetchVendors = async () => {
    const response = await getVendors(page, size, search, status);
    setVendorsPage(response);
  };

  const handleAddVendor = async (data: VendorFormData) => {
    await addVendor(data);
    setPage(0);
    fetchVendors();
  };

  const handleEditVendor = async (vendorId: string, data: VendorFormData) => {
    await updateVendor(vendorId, data);
    setPage(0);
    fetchVendors();
  }

  const handleDeleteVendor = async (vendorId: string) => {
    await deleteVendor(vendorId);
    setPage(0);
    fetchVendors();
  }

  useEffect(() => {
    fetchVendors();
  }, [page, size, search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vendors</h1>
        <p className="text-sm text-muted-foreground">
          Manage vendors and supplier information.
        </p>
      </div>
    </div>

    {vendorsPage && (
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <TableToolbar
          search={{
            value: searchInput,
            onChange: setSearchInput,
            placeholder: "Search vendors...",
          }}
          filters={[
            {
              placeholder: "Status",
              value: status,
              onChange: (value) =>
                setStatus(value as VendorStatus | undefined),
              allLabel: "All",
              options: VENDOR_STATUS,
            },
          ]}
          actions={<AddVendorDialog handleAddVendor={handleAddVendor} />}
        />

        <VendorTable
          vendors={vendorsPage.content}
          page={page}
          size={size}
          totalElements={vendorsPage.totalElements}
          totalPages={vendorsPage.totalPages}
          onPageChange={setPage}
          onSizeChange={setSize}
          handleEditVendor={handleEditVendor}
          handleDeleteVendor={handleDeleteVendor}
        />
      </div>
    )}
  </div>
);
}

export default VendorsPage;
