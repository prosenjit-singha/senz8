import { apiHandler } from "@/helpers/api.handler";
import { recoverCustomer } from "@/services/shopify/shopify-customer.services";

export const POST = apiHandler(
  {
    successMsg: "Recovery email sent successfully",
    errorMsg: "Failed to send recovery email",
  },
  async ({ req }) => {
    const { email } = await req.json();
    const result = await recoverCustomer({ email });

    if (result?.customerUserErrors.length) {
      return {
        success: false,
        statusCode: 400,
        error: {
          type: "bad-request",
          message: "Bad Request",
          data: result.customerUserErrors,
        },
      };
    } else {
      return {
        success: true,
        statusCode: 200,
        message: "Recovery email sent successfully",
        data: { email },
      };
    }
  }
);
