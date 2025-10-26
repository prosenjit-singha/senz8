import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import DefaultAddressForm from "./_components/default-address-form";
import { DefaultAddressFormProvider } from "./_components/default-address-form.provider";
import CustomerDeliveryAddressList from "./_components/delivery-address-list";

export default function CustomerAddresses() {
  return (
    <DefaultAddressFormProvider>
      <section className="flex flex-col lg:flex-row gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Address List</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <CustomerDeliveryAddressList />
          </CardContent>
        </Card>
        <DefaultAddressForm />
      </section>
    </DefaultAddressFormProvider>
  );
}
