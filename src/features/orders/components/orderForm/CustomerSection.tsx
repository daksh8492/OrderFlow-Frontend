import { Controller, useFormContext } from "react-hook-form";
import { Search } from "lucide-react";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import type { OrderFormData } from "../../schema/orderSchema";


interface CustomerSectionProps {
  isLoading?: boolean;
}

export default function CustomerSection({
  isLoading = false,
}: CustomerSectionProps) {
  const { control } = useFormContext<OrderFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Customer</h2>
        <p className="text-sm text-muted-foreground">
          Select the customer for this order.
        </p>
      </div>

      <FieldGroup>
        <Controller
          name="customerId"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="customerId">
                Customer
              </FieldLabel>

              <InputGroup>
                <InputGroupText>
                  <Search className="h-4 w-4" />
                </InputGroupText>

                <Input
                  {...field}
                  id="customerId"
                  value={field.value ?? ""}
                  placeholder="Search customer..."
                  disabled={isLoading}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
              </InputGroup>

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}