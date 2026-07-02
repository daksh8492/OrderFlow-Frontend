import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { type VendorFormData, vendorSchema } from "../schema/vendorSchema";
import { zodResolver } from "@hookform/resolvers/zod";

function VendorForm({
  defaultValues,
  submitText,
  onSubmit,
}: {
  defaultValues?: VendorFormData;
  submitText: string;
  onSubmit: (data: VendorFormData) => void;
}) {
    const form = useForm<VendorFormData>({
        resolver: zodResolver(vendorSchema),
        defaultValues: defaultValues,
    })

  const handleSubmit = (data: VendorFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="vendorName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Vendor Name</FieldLabel>
              <Input {...field} placeholder="Enter vendor name" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="vendorBrand"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Brand</FieldLabel>
              <Input {...field} placeholder="Enter brand" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="contactEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <Input {...field} type="email" placeholder="Enter email" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="contactNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Mobile Number</FieldLabel>
              <Input {...field} placeholder="Enter mobile number" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="contactTelephone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Telephone</FieldLabel>
              <Input {...field} placeholder="Enter telephone" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>City</FieldLabel>
              <Input {...field} placeholder="Enter city" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="currency"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Currency</FieldLabel>
              <Input {...field} placeholder="INR" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="paymentTerms"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Payment Terms</FieldLabel>
              <Input {...field} placeholder="e.g. NET 30" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="minimumOrderValue"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Minimum Order Value</FieldLabel>
              <Input
                {...field}
                type="number"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="TRN"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>TRN</FieldLabel>
              <Input {...field} placeholder="Enter TRN" />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Address</FieldLabel>
            <Input {...field} placeholder="Enter address" />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex justify-end">
        <Button type="submit">{submitText}</Button>
      </div>
    </form>
  );
}

export default VendorForm;
