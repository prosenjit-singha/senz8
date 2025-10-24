import { NextRequest, NextResponse } from "next/server";
import { zCustomerInputSchema } from "@/zod-schemas/shopify/customer.z";
import { createShopifyCustomer } from "@/services/shopify/shopify-customer.services";
import z from "zod";
import { IApiFailedResponse, IApiSuccessResponse } from "@/interfaces";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    const parsed = zCustomerInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    const result = await createShopifyCustomer(parsed.data);

    if (result?.data?.customerCreate?.userErrors?.length) {
      return NextResponse.json({ errors: result.data }, { status: 400 });
    }

    const response: IApiSuccessResponse = {
      success: true,
      statusCode: 201,
      message: "Customer created successfully",
      data: result,
      error: null,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const flatten = z.flattenError(err).fieldErrors;
      const message = z.prettifyError(err);

      const response: IApiFailedResponse = {
        data: null,
        success: false,
        statusCode: 400,
        message: "Validation Error Occurred",
        error: {
          type: "zod-error",
          message: message,
          data: flatten,
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: IApiFailedResponse = {
      data: null,
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      error: {
        type: "internal-server-error",
        message: "Internal Server Error",
        data: null,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
