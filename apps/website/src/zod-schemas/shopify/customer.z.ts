// lib/schemas/customer.schema.ts
import { z } from "zod";

/**
 * Common helpers
 */
const zE164Regex = /^\+?[1-9]\d{1,14}$/;

export const zPhoneNumber = z
  .string()
  .regex(zE164Regex, "Phone must be E.164 format");

const zPassword = z
  .string()
  .min(8, { message: "Be at least 8 characters long" })
  .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
  .regex(/[0-9]/, { message: "Contain at least one number." })
  .regex(/[^a-zA-Z0-9\s]/, {
    message: "Contain at least one special character.",
  })
  .trim();

/**
 * MailingAddressInput (Shopify)
 * - simplified, include common fields only
 */
export const zMailingAddressSchema = z.object({
  address1: z.string().min(1).optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  provinceCode: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  zip: z.string().optional(),
  phone: zPhoneNumber.optional(),
  company: z.string().optional(),
  name: z.string().optional(),
});

/**
 * Marketing consent shapes (SMS + Email)
 *
 * Warning: exact enum values are defined by Shopify; adjust if you need strict checks.
 */
const zMarketingStateEnum = z.union([
  z.literal("SUBSCRIBED"),
  z.literal("UNSUBSCRIBED"),
  z.literal("PENDING"),
  z.literal("NOT_SUBSCRIBED"),
  z.literal("UNKNOWN"),
]);

const zMarketingOptInLevelEnum = z.union([
  z.literal("SINGLE_OPT_IN"),
  z.literal("DOUBLE_OPT_IN"),
  z.literal("UNKNOWN"),
]);

export const zSmsMarketingConsentSchema = z
  .object({
    marketingState: zMarketingStateEnum.optional(),
    marketingOptInLevel: zMarketingOptInLevelEnum.optional(),
    consentUpdatedAt: z.string().optional(), // datetime ISO string
    // If Shopify returns extra fields, allow them:
  })
  .partial();

export const zEmailMarketingConsentSchema = z
  .object({
    marketingState: zMarketingStateEnum.optional(),
    marketingOptInLevel: zMarketingOptInLevelEnum.optional(),
    consentUpdatedAt: z.string().optional(),
  })
  .partial();

/**
 * CustomerInput (main schema)
 */
export const zCustomerInputSchema = z
  .object({
    email: z.string().email(), // Shopify requires email or phone
    phone: z
      .string()
      .regex(zE164Regex, "Phone must be in E.164 format (e.g. +16465555555)")
      .optional(),
    firstName: z.string().min(1, "First name is required").max(255),
    lastName: z.string().max(255).optional(),
    note: z.string().optional(),
    tags: z
      .array(z.string().trim())
      .default([])
      .optional()
      .refine((arr) => !arr?.some((t) => t.includes(",")), {
        message: "Tags should be provided as an array of strings (no commas).",
      }),
    verifiedEmail: z.boolean().optional(),
    taxExempt: z.boolean().optional(),

    // Addresses
    addresses: z.array(zMailingAddressSchema).optional(),

    // Marketing consent objects
    smsMarketingConsent: zSmsMarketingConsentSchema.optional(),
    emailMarketingConsent: zEmailMarketingConsentSchema.optional(),

    // Other optional Shopify fields you may want later:
    // acceptsMarketing: z.boolean().optional(),
    // currency: z.string().optional(),
  })
  .refine(
    (data) => {
      // Ensure at least email OR phone present (Shopify requires at least one)
      return Boolean(data.email || data.phone);
    },
    {
      message: "At least one contact method is required: email or phone.",
    }
  );

export const zCustomerSignUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First must be at least 2 characters long"),
  lastName: z.string().trim(),
  email: z.email(),
  phone: z
    .string()
    .regex(zE164Regex, "Phone must be in E.164 format (e.g. +91465555555)")
    .optional(),
  password: zPassword,
  confirmPassword: z.string().trim().min(1, "Confirm password is required"),
  acceptsMarketing: z.coerce.boolean<boolean>(),
});

export const zCustomerSignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

/**
 * TS types
 */
export type CustomerInput = z.infer<typeof zCustomerInputSchema>;
export type CustomerSignUpBody = z.infer<typeof zCustomerSignUpSchema>;
export type CustomerSignInBody = z.infer<typeof zCustomerSignInSchema>;
