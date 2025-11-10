import { apiHandler } from "@/helpers/api.handler";
import {
  createSession,
  deleteSession,
  renewSession,
  updateSession,
} from "@/lib/auth/auth.session";
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

// create session
export const PUT = apiHandler(
  {
    successMsg: "User session created successfully",
    errorMsg: "Failed to create user session",
  },
  async ({ req }) => {
    const body = (await req.json()) as Session;
    const session = await createSession(body);
    if (session) {
      return {
        statusCode: 200,
        data: session,
        error: null,
        success: true,
      };
    } else {
      return {
        statusCode: 400,
        data: null,
        error: {
          type: "validation",
          message: "Bad request",
          data: null,
        },
        success: false,
      };
    }
  }
);

// update session
export const POST = apiHandler(
  {
    validateSession: true,
    errorMsg: "Failed to update user session",
    successMsg: "User session updated successfully",
  },
  async ({ req }) => {
    const body = (await req.json()) as Session;
    const session = await updateSession(body);
    if (session) {
      return {
        statusCode: 200,
        data: session,
        error: null,
        success: true,
      };
    } else {
      return {
        statusCode: 401,
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

// renew session
export const PATCH = apiHandler(
  {
    validateSession: true,
    successMsg: "User session renewed successfully",
    errorMsg: "Failed to renew user session",
  },
  async () => {
    const newSession = await renewSession();
    if (newSession) {
      return {
        success: true,
        statusCode: 200,
        data: newSession,
        error: null,
      };
    } else {
      return {
        success: false,
        statusCode: 401,
        data: null,
        error: {
          message: "User session not found or expired",
          type: "validation",
          data: null,
        },
      };
    }
  }
);

export const DELETE = apiHandler(
  {
    errorMsg: "Failed to delete user session",
    successMsg: "User session deleted successfully",
  },
  async () => {
    await deleteSession();
    return {
      success: true,
      statusCode: 200,
      data: null,
      error: null,
    };
  }
);
