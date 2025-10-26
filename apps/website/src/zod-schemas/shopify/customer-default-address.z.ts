import z from "zod";
import { zPhoneNumber } from "./customer.z";

export const zShopifyCustomerAddress = z.object({
  id: z.string().trim().min(1, "Address ID is required").optional(),
  address1: z.string().trim().min(1, "Address is required"),
  address2: z.string().trim(),
  /** The name of the city, district, village, or town. */
  city: z.string().trim().min(1, "City is required"),
  /** The name of the customer's company or organization. */
  company: z.string().trim(),
  country: z.string().trim().min(1, "Country Name is required"),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  phone: zPhoneNumber,
  /** The region of the address, such as the province, state, or district. */
  province: z.string().trim().min(1, "Province is required"),
  /** The zip or postal code of the address. */
  zip: z.string().trim().min(1, "Zip is required"),
});
