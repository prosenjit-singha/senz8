import { apiHandler } from "@/helpers/api.handler";
import { deleteSession, updateSession } from "@/lib/auth/auth.session";
import { Session } from "@/lib/auth/auth.type";

export const GET = apiHandler(
  {
    validateSession: true,
    errorMsg: "User session retrieved successfully",
    successMsg: "User session retrieved successfully",
  },
  async ({ session }) => {
    return {
      statusCode: 200,
      message: "User session retrieved successfully",
      data: session,
      error: null,
      success: true,
    };
  }
);

export const POST = apiHandler(
  {
    validateSession: true,
    errorMsg: "User session updated successfully",
    successMsg: "User session updated successfully",
  },
  async ({ req }) => {
    const body = (await req.json()) as Session;
    const session = await updateSession(body);
    if (session) {
      return {
        statusCode: 200,
        message: "User session updated successfully",
        data: session,
        error: null,
        success: true,
      };
    } else {
      return {
        statusCode: 401,
        message: "User session not found",
        data: null,
        error: {
          message: "User session not found or expired",
          type: "validation",
          data: null,
        },
        success: false,
      };
    }
  }
);

export const DELETE = apiHandler(
  {
    errorMsg: "User session deleted successfully",
    successMsg: "User session deleted successfully",
  },
  async () => {
    const result = await deleteSession();
    return {
      statusCode: 200,
      message: "User session deleted successfully",
      data: null,
      error: null,
      success: true,
    };
  }
);
