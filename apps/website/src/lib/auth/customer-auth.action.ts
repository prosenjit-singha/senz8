"use server";

import {
  CustomerSignUpBody,
  CustomerSignInBody,
  zCustomerSignInSchema,
  zCustomerSignUpSchema,
} from "@/zod-schemas/shopify/customer.z";
import z from "zod";
import {
  createCustomer,
  createToken,
} from "../shopify/shopify.customer.service";
import { createSession, deleteSession } from "./auth.session";
import { Session } from "./auth.type";

type SignUpFormState =
  | {
      success: boolean;
      errors?: ReturnType<
        typeof z.flattenError<CustomerSignUpBody>
      >["fieldErrors"];
      message?: string;
    }
  | undefined;

export async function signup(
  initialState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  // 1. Validate form fields
  const validatedFields = zCustomerSignUpSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    phone: formData.get("phone"),
    acceptsMarketing: formData.get("acceptsMarketing"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { confirmPassword, ...rest } = validatedFields.data;

  const result = await createCustomer(rest);

  if (result?.customerUserErrors.length) {
    return {
      success: false,
      message: result.customerUserErrors
        .map((err) => err.message)
        .filter(Boolean)
        .join(", "),
    };
  }

  const tokenResult = await createToken(
    validatedFields.data.email,
    validatedFields.data.password
  );

  if (tokenResult.data && result) {
    await createSession(
      {
        accessToken: tokenResult.data.accessToken,
        user: {
          id: result.customer.id,
          displayName:
            tokenResult.customer?.displayName ?? result.customer.firstName,
          email: result.customer.email,
          phone: result.customer.phone,
          role: "customer",
        },
        expiredAt: tokenResult.data.expiresAt,
      },
      "/"
    );
  }
}

type SignInFormState =
  | {
      success: boolean;
      session: Session | null;
      errors?: ReturnType<
        typeof z.flattenError<CustomerSignInBody>
      >["fieldErrors"];
      message?: string;
    }
  | undefined;

export async function login(
  initialState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  // 1. Validate form fields
  const { success, data, error } = zCustomerSignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (success) {
    const result = await createToken(data.email, data.password);
    console.log("Create Token Result", result);
    if (result.data && result.customer) {
      const session: Session = {
        accessToken: result.data?.accessToken!,
        user: {
          id: result.customer?.id!,
          displayName:
            result.customer?.displayName ?? result.customer?.firstName,
          email: result.customer?.email,
          phone: result.customer?.phone,
          role: "customer",
        },
        expiredAt: result.data?.expiresAt!,
      };
      await createSession(session);
      return {
        success: true,
        session,
      };
    } else {
      return {
        success: false,
        session: null,
        message: "Failed to login",
      };
    }
  } else {
    return {
      success: false,
      session: null,
      errors: z.flattenError(error).fieldErrors,
    };
  }
}

export async function logout(redirectURL?: string) {
  await deleteSession(redirectURL);
}
