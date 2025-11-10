import z from "zod";
import { apiHandler } from "@/helpers/api.handler";
import { createToken } from "@/lib/shopify/shopify.customer.service";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const POST = apiHandler(
  {
    successMsg: "Customer signed in successfully",
    errorMsg: "Failed to sign in customer",
  },
  async ({ req }) => {
    const body = await req.json();
    const data = schema.parse(body);
    const result = await createToken(data.email, data.password);

    if (result.customer) {
      return {
        success: true,
        statusCode: 200,
        data: { customer: result.customer, token: result.data },
      };
    } else {
      return {
        success: false,
        statusCode: 400,
        error: {
          type: "authentication",
          message: "Invalid email or password",
          data: result.errors,
        },
      };
    }
  }
);
