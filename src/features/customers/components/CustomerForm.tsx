import {
  customerSchema,
  type CustomerFormData,
} from "../schema/customerSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function CustomerForm(props: {
  defaultValues?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  submitText: string;
}) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: props.defaultValues,
  });

  const handleSubmit = (data: CustomerFormData) => {
    props.onSubmit(data);
  };

  return <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="customerName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter Name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="contactEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="Enter Email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="contactNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="number">Phone Number</FieldLabel>
              <Input
                {...field}
                id="number"
                aria-invalid={fieldState.invalid}
                placeholder="Phone Number"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                {...field}
                id="address"
                aria-invalid={fieldState.invalid}
                placeholder="Enter Address"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input
                {...field}
                id="city"
                aria-invalid={fieldState.invalid}
                placeholder="Enter City"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">{props.submitText}</Button>
      </DialogFooter>
    </form>
}

export default CustomerForm;
