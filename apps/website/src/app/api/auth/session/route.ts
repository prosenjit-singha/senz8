import { apiHandler } from "@/helpers/api.handler";
import { deleteSession, getSession, updateSession } from "@/lib/auth/auth.session";
import { Session } from "@/lib/auth/auth.type";

export const GET = apiHandler(async () => {
  const session = await getSession();

  if (session) {
    return {
      statusCode: 200,
      message: "User session retrieved successfully",
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
});

export const POST = apiHandler(async (req) => {
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
});

export const DELETE = apiHandler(async (req) => {
  const result = await deleteSession();
  return {
    statusCode: 200,
    message: "User session deleted successfully",
    data: null,
    error: null,
    success: true,
  };
});
