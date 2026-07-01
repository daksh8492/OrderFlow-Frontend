import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, type Control } from "react-hook-form";
import type { VariantFormData } from "../../schema/variantSchema";

function VariantAttributesField(props: { control: Control<VariantFormData> }) {
  const { control } = props;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FieldLabel>Specifications</FieldLabel>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              key: "",
              value: "",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Attribute
        </Button>
      </div>

      <FieldGroup>
        {fields.length ? fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-3">
            <Controller
              control={control}
              name={`attributes.${index}.key`}
              render={({ field, fieldState }) => (
                <Field className="flex-1" data-invalid={fieldState.invalid}>
                  <Input {...field} placeholder="Key" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name={`attributes.${index}.value`}
              render={({ field, fieldState }) => (
                <Field className="flex-1" data-invalid={fieldState.invalid}>
                  <Input {...field} placeholder="Value" />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )) : <div className="text-xs text-muted-foreground flex justify-center">No specifications added yet.</div>}
      </FieldGroup>
    </div>
  );
}

export default VariantAttributesField;
