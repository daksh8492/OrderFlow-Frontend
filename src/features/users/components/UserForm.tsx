import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { FIELD_OF_WORK } from "../types/user";
import { Input } from "@/components/ui/input";
import { userSchema, type UserFormData } from "../schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Warehouse } from "@/features/warehouses/types/warehouse";
import { getWarehouses } from "@/features/warehouses/api/warehouseApi";

function UserForm(props: {
  defaultValues?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  submitText: string;
}) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: props.defaultValues,
  });

  const handleSubmit = async (data: UserFormData) => {
    await props.onSubmit(data);
  };

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      const respone = await getWarehouses(0, 100);
      setWarehouses(respone.content);
    };

    fetchWarehouses();
  }, []);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="name"
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
          name="fieldOfWork"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fieldOfWork">Field of Work</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose field of work" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OF_WORK.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="warehouseId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Warehouse ID</FieldLabel>
              {/* <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Enter warehouse id"
              /> */}
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh.warehouseId} value={wh.warehouseId}>
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Address</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Enter address"
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
              <FieldLabel>City</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Enter city"
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
              <FieldLabel>Contact Number</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="9876543210"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="contactTelephone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Contact Telephone</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Enter telephone"
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
              <FieldLabel>Email</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                type="email"
                placeholder="example@email.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="salary"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Salary</FieldLabel>
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
                placeholder="Enter salary"
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
  );
}

export default UserForm;
