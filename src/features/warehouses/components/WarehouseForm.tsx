import { Controller, useForm } from "react-hook-form";
import {
  type WarehouseFormData,
  warehouseSchema,
} from "../schema/warehouseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function WarehouseForm(props: {
  defaultValues?: WarehouseFormData;
  onSubmit: (data: WarehouseFormData) => void;
  submitText: string
}) {
  const { onSubmit } = props;

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: props.defaultValues,
  });

  const handleSubmit = async (data: WarehouseFormData) => {
    await onSubmit(data);
  };

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

export default WarehouseForm;
