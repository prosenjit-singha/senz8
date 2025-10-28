import { apiHandler } from "@/helpers/api.handler";
import { createSession } from "@/lib/auth/auth.session";
import {
  createCustomer,
  createToken,
} from "@/lib/shopify/shopify.customer.service";
import { zCustomerSignUpSchema } from "@/zod-schemas/shopify/customer.z";
import z from "zod";

/** Sign In */
export const POST = apiHandler(
  {
    errorMsg: "Customer created successfully",
    successMsg: "Customer created successfully",
  },
  async ({ req }) => {
    const body = await req.json();
    // 1. Validate form fields
    const validatedFields = zCustomerSignUpSchema.safeParse(body);

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        success: true,
        statusCode: 400,
        data: null,
        message: "Validation error occurred",
        error: {
          type: "zod-error",
          message: "Validation error occurred",
          data: z.flattenError(validatedFields.error).fieldErrors,
        },
      };
    }

    const result = await createCustomer(validatedFields.data);

    console.log("Create Customer Result", JSON.stringify(result));

    if (result?.customerUserErrors.length) {
      return {
        success: true,
        statusCode: 400,
        data: null,
        message: result.customerUserErrors
          .map((err) => err.message)
          .filter(Boolean)
          .join(", "),
        error: {
          type: "validation",
          message: "Validation error occurred",
          data: result.customerUserErrors,
        },
      };
    }

    const tokenResult = await createToken(
      validatedFields.data.email,
      validatedFields.data.password
    );

    console.log("Create Token Result", JSON.stringify(tokenResult));

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

    return {
      success: true,
      statusCode: 200,
      data: null,
      message: "Customer created successfully",
      error: null,
    };
  }
);
