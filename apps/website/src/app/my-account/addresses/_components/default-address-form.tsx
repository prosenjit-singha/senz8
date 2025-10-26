"use client";
import { Card, CardFooter } from "@workspace/ui/components/card";
import { useCustomerAddressForm } from "./default-address-form.provider";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field";
import { Controller } from "react-hook-form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { SaveIcon, TrashIcon } from "lucide-react";
import ConfirmationAlert from "@workspace/next-ui/components/confirmation-alert";
import {
  useAddDeliveryAddress,
  useDeleteDeliveryAddress,
  useGetMyAccountDetailsQuery,
  useUpdateDeliveryAddress,
  useUpdateDeliveryDefaultAddress,
} from "@/hooks/api/shopify-customer.hooks";
import { toast } from "sonner";
import { Spinner } from "@workspace/ui/components/spinner";

function DefaultAddressForm() {
  const form = useCustomerAddressForm();
  const { data } = useGetMyAccountDetailsQuery();
  const { mutateAsync: add, isPending: addPending } = useAddDeliveryAddress();
  const { mutateAsync: update, isPending: updatePending } =
    useUpdateDeliveryAddress();
  const { mutateAsync: deleteAddress, isPending: deletePending } =
    useDeleteDeliveryAddress();
  const {
    mutateAsync: updateDefaultAddress,
    isPending: updateDefaultAddressPending,
  } = useUpdateDeliveryDefaultAddress();

  const [id] = form.watch(["id"]);

  const handleDelete = () => {
    const { id } = form.getValues();

    if (!id) {
      toast.error("Failed to delete address", {
        description: "Delete address id not found!",
      });
      return;
    }

    return toast
      .promise(deleteAddress(id), {
        loading: "Deleting address...",
        success: "Address deleted successfully",
        error: "Failed to delete address",
      })
      .unwrap();
  };

  const handleUpsert = form.handleSubmit(async () => {
    const { id, ...body } = form.getValues();
    if (id) {
      return toast.promise(update({ id, ...body }), {
        loading: "Updating address...",
        success: (res) => {
          form.setValue("id", res?.id);
          return "Address updated successfully";
        },
        error: "Failed to update address",
      });
    } else {
      return toast.promise(add(body), {
        loading: "Adding address...",
        success: (res) => {
          form.setValue("id", res?.id);
          return "Address added successfully";
        },
        error: "Failed to add address",
      });
    }
  });

  const handleUpdateDefaultAddress = () => {
    const { id } = form.getValues();

    toast.success("Address updated successfully");

    if (!id) {
      toast.error("Failed to update default address", {
        description: "Default address id not found!",
      });
      return;
    }

    return toast
      .promise(updateDefaultAddress(id), {
        loading: "Updating default address...",
        success: () => {
          form.reset({
            firstName: "",
            lastName: "",
            company: "",
            address1: "",
            address2: "",
            city: "",
            country: "",
            phone: "",
            province: "",
            zip: "",
          });
          return "Default address updated successfully";
        },
        error: "Failed to update default address",
      })
      .unwrap();
  };

  const isLoading =
    addPending || updatePending || deletePending || updateDefaultAddressPending;

  return (
    <Card className="flex-1">
      <FieldSet className="px-6">
        <FieldLegend>Address Details</FieldLegend>
        <FieldDescription>
          Please fill address details with proper information
        </FieldDescription>
        <FieldGroup className="grid sm:grid-cols-2 gap-4 lg:gap-x-8 ">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>First name</FieldLabel>
                <Input
                  {...field}
                  placeholder="John"
                  required
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Last name</FieldLabel>
                <Input
                  {...field}
                  placeholder="Doe"
                  required
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                <Input
                  {...field}
                  placeholder="123 Main St"
                  required
                  type="tel"
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="company"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter Company Name (Optional)"
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="address1"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="">
                <FieldLabel htmlFor={field.name}>Address 1</FieldLabel>
                <Input
                  {...field}
                  placeholder="123 Main St"
                  required
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="address2"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Address 2</FieldLabel>
                <Input
                  {...field}
                  placeholder="Apt 1"
                  required
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>City</FieldLabel>
                <Input
                  {...field}
                  placeholder="City"
                  required
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="province"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Province</FieldLabel>
                <Input
                  {...field}
                  placeholder="Province"
                  required
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="zip"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Zip</FieldLabel>
                <Input
                  {...field}
                  placeholder="Zip"
                  required
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                <Input
                  {...field}
                  placeholder="India"
                  required
                  value={field.value || ""}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
      <CardFooter className="flex sm:flex-row flex-col justify-end gap-4 md:gap-8">
        <ConfirmationAlert
          title="Delete Address"
          description="Are you sure you want to delete this address?"
          confirmationText="Yes, Delete"
          onConfirm={handleDelete}
        >
          <Button
            data-hidden={!id}
            disabled={isLoading}
            variant="destructive"
            className="mr-auto flex-1 data-[hidden=true]:hidden"
          >
            <TrashIcon /> Delete Address
          </Button>
        </ConfirmationAlert>
        <Button
          variant={"outline"}
          className="flex-1 data-[hidden=true]:hidden"
          data-hidden={!id || id === data?.defaultAddress?.id}
          disabled={!form.formState.isValid || !id || isLoading}
          onClick={handleUpdateDefaultAddress}
        >
          <SaveIcon /> Make It Default
        </Button>
        <Button onClick={handleUpsert} className="flex-1" disabled={isLoading}>
          {addPending || updatePending ? (
            <>
              <Spinner className="size-4" /> {id ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <SaveIcon /> {id ? "Update Address" : "Add Address"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DefaultAddressForm;
