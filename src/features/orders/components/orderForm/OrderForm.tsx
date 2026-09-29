import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Search, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { orderSchema, type OrderFormData } from "../../schema/orderSchema";
import { ORDER_PRIORITY, PAYMENT_STATUS } from "../../types/order";
import { getCustomers, getCustomerById } from "@/features/customers/api/customerApi";
import { getVariantById } from "@/features/items/api/itemApi";
import { formatEnum } from "@/utils/format";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer } from "@/features/customers/types/customer";
import type { Variant } from "@/features/items/types/item";
import { useItemSearch } from "@/hooks/useItemSearch";
import { ItemVariantSearchInput } from "@/components/common/ItemVariantSearchInput";

interface OrderFormProps {
  defaultValues?: Partial<OrderFormData>;
  onSubmit: (data: OrderFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

function OrderForm({
  onSubmit,
  defaultValues,
  isLoading: isSubmitLoading = false,
  onCancel,
}: OrderFormProps) {
  const isEditMode = !!defaultValues?.orderId;

  const form = useForm<
    z.input<typeof orderSchema>,
    any,
    z.output<typeof orderSchema>
  >({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: "PENDING",
      priority: "MEDIUM",
      paymentStatus: "PENDING",
      items: [],
      subtotal: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalAmount: 0,
      ...defaultValues,
    } as any,
  });

  const { control, handleSubmit, setValue, register } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // API State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);

  // Item search — logic lives in the reusable useItemSearch hook
  const itemSearch = useItemSearch();

  // Watch items and recalculate values
  const watchedItems = useWatch({
    control,
    name: "items",
  }) || [];

  // Fetch customers with debounce
  useEffect(() => {
    const fetchCustomersData = async () => {
      setIsCustomerLoading(true);
      try {
        const response = await getCustomers(0, 10, customerSearch);
        setCustomers(response.content || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setIsCustomerLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCustomersData();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [customerSearch]);

  // Load customer name on edit mode if customerId is pre-defined
  useEffect(() => {
    if (defaultValues?.customerId) {
      const loadCustomer = async () => {
        try {
          const c = await getCustomerById(defaultValues.customerId!);
          setCustomerSearch(c.customerName);
        } catch (e) {
          console.error("Failed to load edit customer details", e);
        }
      };
      loadCustomer();
    }
  }, [defaultValues?.customerId]);

  // Load variant details (names and SKUs) for existing items on edit mode
  useEffect(() => {
    if (defaultValues?.items && defaultValues.items.length > 0) {
      const loadVariantDetails = async () => {
        try {
          const promises = (defaultValues.items ?? []).map(async (item, index) => {
            if (item.variantId) {
              const v = await getVariantById(item.variantId);
              setValue(`items.${index}.name`, v.name);
              setValue(`items.${index}.sku`, v.sku || "");
            }
          });
          await Promise.all(promises);
        } catch (e) {
          console.error("Failed to load variant details for edit mode", e);
        }
      };
      loadVariantDetails();
    }
  }, [defaultValues?.items, setValue]);

  // Item search logic is handled entirely by the useItemSearch hook above.

  const handleAddVariant = (variant: Variant, itemName: string) => {
    const alreadyExists = watchedItems?.some((item) => item.variantId === variant.variantId);
    if (alreadyExists) {
      toast.error("This variant is already added to the order");
      return;
    }

    append({
      variantId: variant.variantId,
      name: `${itemName} - ${variant.name}`,
      sku: variant.sku || "",
      rate: variant.sellingPrice || 0,
      quantity: 1,
      taxRate: 0,
      taxAmount: 0,
      discountType: "VALUE",
      discountValue: 0,
      discountAmount: 0,
      itemTotal: variant.sellingPrice || 0,
    });

    itemSearch.clearSearch();
    toast.success(`${itemName} - ${variant.name} added`);
  };

  // Auto-fill Receiver details when Customer is selected
  const handleCustomerSelect = (customerId: string) => {
    const selected = customers.find((c) => c.customerId === customerId);
    if (selected) {
      setValue("customerId", selected.customerId, { shouldValidate: true });
      setValue("receiverName", selected.customerName, { shouldValidate: true });
      setValue("receiverPhone", selected.contactNumber, { shouldValidate: true });
      setValue("receiverAddress", `${selected.address}, ${selected.city}`, { shouldValidate: true });
    }
  };

  // Render-time Calculations for real-time responsiveness in the UI
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  watchedItems.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const itemSub = qty * rate;

    let discountAmt = 0;
    if (item.discountType === "PERCENTAGE") {
      discountAmt = (itemSub * (Number(item.discountValue) || 0)) / 100;
    } else {
      discountAmt = Number(item.discountValue) || 0;
    }

    const postDiscount = Math.max(0, itemSub - discountAmt);
    const taxAmt = (postDiscount * (Number(item.taxRate) || 0)) / 100;

    subtotal += itemSub;
    totalDiscount += discountAmt;
    totalTax += taxAmt;
  });

  const totalAmount = subtotal - totalDiscount + totalTax;

  const onFormSubmit = (data: OrderFormData) => {
    const calculatedItems = data.items.map((item) => {
      const qty = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const itemSub = qty * rate;

      let discountAmount = 0;
      if (item.discountType === "PERCENTAGE") {
        discountAmount = (itemSub * (Number(item.discountValue) || 0)) / 100;
      } else {
        discountAmount = Number(item.discountValue) || 0;
      }

      const postDiscount = Math.max(0, itemSub - discountAmount);
      const taxAmount = (postDiscount * (Number(item.taxRate) || 0)) / 100;
      const itemTotal = postDiscount + taxAmount;

      return {
        ...item,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        itemTotal: parseFloat(itemTotal.toFixed(2)),
      };
    });

    const calculatedSubtotal = calculatedItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    const calculatedTotalDiscount = calculatedItems.reduce((acc, item) => acc + item.discountAmount, 0);
    const calculatedTotalTax = calculatedItems.reduce((acc, item) => acc + item.taxAmount, 0);
    const calculatedTotalAmount = calculatedSubtotal - calculatedTotalDiscount + calculatedTotalTax;

    onSubmit({
      ...data,
      items: calculatedItems,
      subtotal: parseFloat(calculatedSubtotal.toFixed(2)),
      totalDiscount: parseFloat(calculatedTotalDiscount.toFixed(2)),
      totalTax: parseFloat(calculatedTotalTax.toFixed(2)),
      totalAmount: parseFloat(calculatedTotalAmount.toFixed(2)),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 max-w-6xl mx-auto pb-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{isEditMode ? "Update Order" : "Create Order"}</h1>
          <p className="text-xs text-muted-foreground">{isEditMode ? "Edit and update existing order details." : "Setup customer, delivery details, and items."}</p>
        </div>
      </div>

      {/* Top Section - Fits inside a compact height */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer & Order Options */}
        <div className="md:col-span-1 space-y-4">
          {/* Customer Selection Card */}
          <div className="rounded-lg border bg-card p-4 shadow-xs space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
              <ShoppingBag size={15} className="text-primary" />
              Customer
            </h2>

            <div className="relative">
              <Controller
                name="customerId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        id="customerSearchInput"
                        className="pl-8 h-8 text-xs"
                        placeholder="Search customer name..."
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value);
                          if (!e.target.value) {
                            field.onChange("");
                          }
                        }}
                      />
                    </div>
                    {isCustomerLoading && (
                      <div className="absolute right-2 top-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      </div>
                    )}

                    {customerSearch && customers.length > 0 && !field.value && (
                      <div className="absolute z-50 w-full mt-1 max-h-48 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-sm text-xs">
                        {customers.map((c) => (
                          <div
                            key={c.customerId}
                            className="relative flex cursor-pointer select-none items-center rounded-xs px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
                            onClick={() => {
                              handleCustomerSelect(c.customerId);
                              setCustomerSearch(c.customerName);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold">{c.customerName}</span>
                              <span className="text-[10px] text-muted-foreground">{c.city}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </div>

          {/* Order Options Card */}
          <div className="rounded-lg border bg-card p-4 shadow-xs space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Options</h2>
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="priority"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-[10px]">Priority</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitLoading}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_PRIORITY.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {formatEnum(priority)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="paymentStatus"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-[10px]">Payment</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitLoading}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_STATUS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {formatEnum(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </div>
        </div>

        {/* Delivery / Receiver Details */}
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card p-4 shadow-xs space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Delivery Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                name="receiverName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="receiverName" className="text-[10px]">Receiver Name</FieldLabel>
                    <Input
                      {...field}
                      id="receiverName"
                      className="h-8 text-xs"
                      placeholder="Receiver contact person"
                      disabled={isSubmitLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="receiverPhone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="receiverPhone" className="text-[10px]">Receiver Phone</FieldLabel>
                    <Input
                      {...field}
                      id="receiverPhone"
                      className="h-8 text-xs"
                      placeholder="Phone number"
                      disabled={isSubmitLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="receiverAddress"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="receiverAddress" className="text-[10px]">Delivery Address</FieldLabel>
                  <Textarea
                    {...field}
                    id="receiverAddress"
                    rows={2}
                    className="text-xs"
                    placeholder="Enter complete shipping address details"
                    disabled={isSubmitLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section - Items List (Left 2 cols) & Financial Summary (Right 1 col) */}
      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Product Items Selector & Table */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-lg border bg-card p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Order Items</h2>
                <p className="text-[10px] text-muted-foreground">Select products and configure quantities.</p>
              </div>
            </div>

            {/* Product/Variant Autocomplete — rendered by the shared ItemVariantSearchInput component */}
            <ItemVariantSearchInput
              itemSearch={itemSearch}
              onVariantSelect={handleAddVariant}
              placeholder="Search variant name..."
            />

            {/* List of Chosen Order Items */}
            {fields.length === 0 ? (
              <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed text-center p-3">
                <p className="font-medium text-xs">No items added to this order</p>
                <p className="text-[10px] text-muted-foreground">Select product variants above to add them.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="hidden md:grid grid-cols-12 gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase px-2">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-3">Discount & Tax</div>
                  <div className="col-span-1 text-right">Total</div>
                </div>

                <div className="divide-y border rounded-md overflow-hidden bg-background">
                  {fields.map((fieldItem, index) => (
                    <div key={fieldItem.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 items-center text-xs">
                      <div className="col-span-1 md:col-span-4 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {watchedItems?.[index]?.name || "Product Item"}
                        </p>
                        {watchedItems?.[index]?.sku && (
                          <p className="text-[10px] text-muted-foreground font-mono truncate">
                            SKU: {watchedItems[index].sku}
                          </p>
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <Input
                          type="number"
                          className="h-8 text-xs"
                          min="1"
                          {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                          placeholder="Qty"
                          disabled={isSubmitLoading}
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <Input
                          type="number"
                          className="h-8 text-xs"
                          step="0.01"
                          {...register(`items.${index}.rate` as const, { valueAsNumber: true })}
                          placeholder="Rate"
                          disabled={isSubmitLoading}
                        />
                      </div>

                      <div className="col-span-1 md:col-span-3 space-y-1.5">
                        <div className="flex gap-1">
                          <select
                            {...register(`items.${index}.discountType` as const)}
                            className="h-8 rounded-md border bg-background px-1 text-[10px] focus-visible:outline-hidden"
                            disabled={isSubmitLoading}
                          >
                            <option value="VALUE">₹</option>
                            <option value="PERCENTAGE">%</option>
                          </select>
                          <Input
                            type="number"
                            className="h-8 text-xs"
                            placeholder="Disc"
                            {...register(`items.${index}.discountValue` as const, { valueAsNumber: true })}
                            disabled={isSubmitLoading}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-muted-foreground whitespace-nowrap">Tax %</span>
                          <Input
                            type="number"
                            className="h-8 text-xs"
                            placeholder="Tax"
                            {...register(`items.${index}.taxRate` as const, { valueAsNumber: true })}
                            disabled={isSubmitLoading}
                          />
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-1 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1.5">
                        <span className="font-bold">
                          ₹{(() => {
                            const item = watchedItems[index];
                            if (!item) return "0.00";
                            const qty = Number(item.quantity) || 0;
                            const rate = Number(item.rate) || 0;
                            const itemSub = qty * rate;
                            let discountAmt = 0;
                            if (item.discountType === "PERCENTAGE") {
                              discountAmt = (itemSub * (Number(item.discountValue) || 0)) / 100;
                            } else {
                              discountAmt = Number(item.discountValue) || 0;
                            }
                            const postDiscount = Math.max(0, itemSub - discountAmt);
                            const taxAmt = (postDiscount * (Number(item.taxRate) || 0)) / 100;
                            return (postDiscount + taxAmt).toFixed(2);
                          })()}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-rose-500 hover:text-rose-600"
                          onClick={() => remove(index)}
                          disabled={isSubmitLoading}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary panel (Right Col) */}
        <div className="rounded-lg border bg-card p-4 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold border-b pb-1.5">Summary</h2>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-rose-500">
              <span>Discount</span>
              <span className="font-mono">-₹{totalDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span className="font-mono">+₹{totalTax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-end">
              <span className="font-bold">Total</span>
              <span className="text-base font-extrabold font-mono text-primary">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button type="submit" className="w-full h-9 text-xs" disabled={isSubmitLoading}>
              {isSubmitLoading ? (
                <>
                  <Loader2 size={12} className="mr-1.5 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Update Order" : "Create Order"
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="w-full h-9 text-xs"
                onClick={onCancel}
                disabled={isSubmitLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default OrderForm;
