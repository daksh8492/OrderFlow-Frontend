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
import { Spinner } from "@/components/ui/spinner";
import AddCustomerDialog from "../components/AddCustomerDialog";

function CustomerPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [customersPage, setCustomersPage] =
    useState<PageResponse<Customer> | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerStatus>();
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    const response = await getCustomers(page, size, search, statusFilter);
    setCustomersPage(response);
    setLoading(false);
  };

  const handleAddCustomer = async (data: CustomerFormData) => {
    try {
      setLoading(true);
      await addCustomer(data);
      toast.success("Customer added successfully");
      await fetchCustomers();
    } catch (error) {
      toast.error("Failed to add customer");
      console.error("Error adding customer: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = async (customerId: string, data: CustomerFormData) => {
    try {
      setLoading(true);
      await updatecustomer(customerId, data);
      toast.success("Customer updated successfully");
      await fetchCustomers();
    } catch (error) {
      toast.error("Failed to update customer");
      console.error("Error updating customer: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      setLoading(true);
      await deleteCustomer(customerId);
      toast.success("Customer deleted successfully");
      await fetchCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error("Error deleting customer: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, [page, size, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage customer information and account status.
          </p>
        </div>
      </div>

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
        actions = {<AddCustomerDialog handleAddCustomer={handleAddCustomer} />}
      />

      {customersPage && (
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
      )}
    </div>
  );
}

export default CustomerPage;
