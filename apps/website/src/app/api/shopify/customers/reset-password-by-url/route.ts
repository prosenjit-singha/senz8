import { apiHandler } from "@/helpers/api.handler";
import { resetPasswordByURL } from "@/services/shopify/shopify-customer.services";

export const POST = apiHandler(
  {
    successMsg: "Password reset successfully",
    errorMsg: "Failed to reset password",
  },
  async ({ req }) => {
    const { resetUrl, password } = await req.json();
    const result = await resetPasswordByURL({ resetUrl, password });

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
