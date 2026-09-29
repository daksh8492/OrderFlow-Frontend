import { useEffect, useState } from "react";
import { addCustomer, deleteCustomer, getCustomers, updatecustomer } from "../api/customerApi";
import CustomerTable from "../components/CustomerTable";
import {
  CUSTOMER_STATUS,
  type Customer,
  type CustomerStatus,
} from "../types/customer";
import type { PageResponse } from "@/types/pageResponse";
import TableToolbar from "@/components/common/TableToolbar";
import type { CustomerFormData } from "../schema/customerSchema";
import { toast } from "sonner";
import AddCustomerDialog from "../components/AddCustomerDialog";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { Loader2 } from "lucide-react";

function CustomerPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [customersPage, setCustomersPage] =
    useState<PageResponse<Customer> | null>(null);
  const { searchInput, search, setSearchInput } = useDebouncedSearch(500, () => setPage(0));
  const [statusFilter, setStatusFilter] = useState<CustomerStatus>();
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers(page, size, search, statusFilter);
      setCustomersPage(response);
    } catch (error) {
      toast.error("Failed to load customers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (data: CustomerFormData) => {
    try {
      await addCustomer(data);
      toast.success("Customer added successfully");
      await fetchCustomers();
    } catch (error) {
      toast.error("Failed to add customer");
      console.error("Error adding customer: ", error);
    }
  };

  const handleEditCustomer = async (customerId: string, data: CustomerFormData) => {
    try {
      await updatecustomer(customerId, data);
      toast.success("Customer updated successfully");
      await fetchCustomers();
    } catch (error) {
      toast.error("Failed to update customer");
      console.error("Error updating customer: ", error);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      toast.success("Customer deleted successfully");
      await fetchCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error("Error deleting customer: ", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, size, search, statusFilter]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-5">
      {/* Toolbar card */}
      <div className="rounded-xl border bg-card p-3">
        <TableToolbar
          search={{
            value: searchInput,
            onChange: setSearchInput,
            placeholder: "Search customers...",
          }}
          filters={[
            {
              placeholder: "Status",
              value: statusFilter,
              onChange: (value) =>
                setStatusFilter(value as CustomerStatus | undefined),
              allLabel: "All",
              options: CUSTOMER_STATUS,
            },
          ]}
          actions={<AddCustomerDialog handleAddCustomer={handleAddCustomer} />}
        />
      </div>

      {/* Count */}
      {customersPage && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">
            {customersPage.totalElements}{" "}
            {customersPage.totalElements === 1 ? "customer" : "customers"}
          </span>
        </div>
      )}

      {/* Table card */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : customersPage ? (
          <CustomerTable
            customers={customersPage.content}
            page={page}
            size={size}
            totalPages={customersPage.totalPages}
            totalElements={customersPage.totalElements}
            onPageChange={setPage}
            onSizeChange={setSize}
            handleEditCustomer={handleEditCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerPage;
