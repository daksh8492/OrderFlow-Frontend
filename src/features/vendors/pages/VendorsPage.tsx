import { useEffect, useState } from "react";
import { addVendor, deleteVendor, getVendors, updateVendor } from "../api/vendorApi";
import type { PageResponse } from "@/types/pageResponse";
import { VENDOR_STATUS, type Vendor, type VendorStatus } from "../types/vendor";
import VendorTable from "../components/VendorTable";
import type { VendorFormData } from "../schema/vendorSchema";
import TableToolbar from "@/components/common/TableToolbar";
import AddVendorDialog from "../components/AddVendorDialog";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function VendorsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { searchInput, search, setSearchInput } = useDebouncedSearch(500, () => setPage(0));
  const [status, setStatus] = useState<VendorStatus>();
  const [vendorsPage, setVendorsPage] = useState<PageResponse<Vendor>>();
  const [loading, setLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await getVendors(page, size, search, status);
      setVendorsPage(response);
    } catch (error) {
      toast.error("Failed to load vendors");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (data: VendorFormData) => {
    try {
      await addVendor(data);
      toast.success("Vendor added successfully");
      await fetchVendors();
    } catch (error) {
      toast.error("Failed to add vendor");
      console.error(error);
    }
  };

  const handleEditVendor = async (vendorId: string, data: VendorFormData) => {
    try {
      await updateVendor(vendorId, data);
      toast.success("Vendor updated successfully");
      await fetchVendors();
    } catch (error) {
      toast.error("Failed to update vendor");
      console.error(error);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      await deleteVendor(vendorId);
      toast.success("Vendor deleted successfully");
      await fetchVendors();
    } catch (error) {
      toast.error("Failed to delete vendor");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [page, size, search, status]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-5">
      {/* Toolbar card */}
      <div className="rounded-xl border bg-card p-3">
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
      </div>

      {/* Count */}
      {vendorsPage && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">
            {vendorsPage.totalElements}{" "}
            {vendorsPage.totalElements === 1 ? "vendor" : "vendors"}
          </span>
        </div>
      )}

      {/* Table card */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : vendorsPage ? (
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
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No vendors found.
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorsPage;
