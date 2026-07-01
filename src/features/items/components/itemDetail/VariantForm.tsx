import { Controller, useForm } from "react-hook-form";
import {
  variantSchema,
  type VariantFormData,
} from "../../schema/variantSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import VariantAttributesField from "./VariantAttributesField";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUpload from "./ImageUpload";

function VariantForm(props: {
  defaultValues?: VariantFormData;
  onSubmit: (data: VariantFormData) => void;
  submitText: string;
}) {
  const form = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      ...props.defaultValues,
      attributes: Object.entries(props.defaultValues?.attributes ?? {}).map(
        ([key, value]) => ({
          key,
          value: value.value as string,
        }),
      ),
      imageUrls: props.defaultValues?.imageUrls ?? [],
    },
  });


  const handleSubmit = (data: VariantFormData) => {
    props.onSubmit(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit, (e) =>
        console.log("Form errors:", e),
      )}
    >
      <FieldGroup>
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
          name="purchasePrice"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="purchasePrice">Purchase Price</FieldLabel>
              <Input
                {...field}
                id="purchasePrice"
                type="number"
                aria-invalid={fieldState.invalid}
                onChange={(e) => field.onChange(Number(e.target.value))}
                placeholder="Enter Purchase Price"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="sellingPrice"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sellingPrice">Selling Price</FieldLabel>
              <Input
                {...field}
                id="sellingPrice"
                type="number"
                aria-invalid={fieldState.invalid}
                onChange={(e) => field.onChange(Number(e.target.value))}
                placeholder="Enter Selling Price"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <VariantAttributesField control={form.control} />
        <ImageUpload form={form} />
      </FieldGroup>
      <DialogFooter className="pt-6">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">{props.submitText}</Button>
      </DialogFooter>
    </form>
  );
}

export default VariantForm;
