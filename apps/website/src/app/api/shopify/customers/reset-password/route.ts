import { apiHandler } from "@/helpers/api.handler";
import { resetPassword } from "@/services/shopify/shopify-customer.services";

export const POST = apiHandler(
  {
    successMsg: "Password reset successfully",
    errorMsg: "Failed to reset password",
  },
  async ({ req }) => {
    const { id, input } = await req.json();
    const result = await resetPassword({ id, input });

    if (result?.customer) {
      return {
        success: true,
        statusCode: 200,
        message: "Password reset successfully",
        data: result,
      };
    } else {
      return {
        success: false,
        statusCode: 400,
        error: {
          type: "bad-request",
          message: "Bad Request",
          data: result?.customerUserErrors,
        },
      };
    }
  }
);
