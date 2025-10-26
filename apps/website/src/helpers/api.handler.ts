import { IApiFailedResponse, IApiSuccessResponse } from "@/interfaces";
import { getSession } from "@/lib/auth/auth.session";
import { Session } from "@/lib/auth/auth.type";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";

type Callback = (
  req: NextRequest,
  session?: Session | null
) => Promise<
  IApiSuccessResponse | IApiFailedResponse | Response | NextResponse
>;

export const apiHandler = (callback: Callback) => async (req: NextRequest) => {
  try {
    const session = await getSession();
    const result = await callback(req, session);
    if (result instanceof NextResponse) {
      return result;
    }
    if (result instanceof Response) {
      return result;
    }

    if (result instanceof Error) {
      return NextResponse.json(
        {
          message: result.message,
          error: {
            type: "internal-server-error",
            message: "Internal server error occurred!",
            data: process.env.NODE_ENV === "development" ? result : undefined,
          },
          statusCode: result.statusCode,
          data: null,
        } as IApiFailedResponse,
        { status: result.statusCode }
      );
    }

    return NextResponse.json(result, { status: result.statusCode });
  } catch (err) {
    console.log("Uncaught Error ", err);
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            type: "zod-error",
            message: "Bad request!",
            data: z.flattenError(err),
          },
          statusCode: 400,
          data: null,
        } as IApiFailedResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong",
        error: {
          type: "internal-server-error",
          message: "Internal server error occurred!",
          data: process.env.NODE_ENV === "development" ? err : undefined,
        },
        statusCode: 500,
        data: null,
      } as IApiFailedResponse,
      { status: 500 }
    );
  }
};
