import { Controller, useFormContext } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { OrderFormData } from "../../schema/orderSchema";

export default function ReceiverSection({
  isLoading = false,
}: {
  isLoading?: boolean;
}) {
  const { control } = useFormContext<OrderFormData>();

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <div>
        <h2 className="text-lg font-semibold">Receiver Information</h2>
        <p className="text-sm text-muted-foreground">
          Enter the delivery recipient details.
        </p>
      </div>

      <FieldGroup className="grid gap-6 md:grid-cols-2">
        <Controller
          name="receiverName"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="receiverName">Receiver Name</FieldLabel>

              <Input
                {...field}
                id="receiverName"
                placeholder="John Doe"
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
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
              <FieldLabel htmlFor="receiverPhone">Receiver Phone</FieldLabel>

              <Input
                {...field}
                id="receiverPhone"
                placeholder="+91 9876543210"
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Controller
        name="receiverAddress"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="receiverAddress">Delivery Address</FieldLabel>

            <Textarea
              {...field}
              id="receiverAddress"
              rows={4}
              placeholder="Enter the complete delivery address..."
              disabled={isLoading}
              aria-invalid={fieldState.invalid}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
