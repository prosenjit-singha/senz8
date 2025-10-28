import { IApiFailedResponse, IApiSuccessResponse } from "@/interfaces";
import { getSession } from "@/lib/auth/auth.session";
import { Session } from "@/lib/auth/auth.type";
import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { connectDB } from "./db.helper";

type Callback<P, V extends boolean = false> = (data: {
  req: NextRequest;
  session: V extends true ? Session : null;
  params: P;
}) => Promise<
  | Omit<IApiSuccessResponse, "message" | "error">
  | Omit<IApiFailedResponse, "message" | "data">
  | Response
  | NextResponse
>;

type Options = {
  errorMsg: string;
  successMsg: string;
  connectDB?: boolean;
  validateSession?: boolean;
};

export const apiHandler =
  <P = Record<string, string>, V extends boolean = false>(
    options: Options & { validateSession?: V },
    callback: Callback<P, V extends true ? true : false>
  ) =>
  async (
    req: NextRequest,
    props: {
      params: Promise<P>;
    }
  ) => {
    try {
      let session: Session | null = null;
      if (options.validateSession) {
        session = await getSession();

        if (!session) {
          return NextResponse.json(
            {
              message: options.errorMsg ?? "User session not found",
              error: {
                type: "authentication",
                message: "User session not found or expired",
                data: null,
              },
              statusCode: 401,
              data: null,
            } as IApiFailedResponse,
            { status: 401 }
          );
        }
      }
      if (options.connectDB) {
        await connectDB();
      }

      const params = await props.params;

      const result = await callback({
        req,
        session: session as any,
        params,
      });

      if (result instanceof NextResponse) {
        return result;
      }
      if (result instanceof Response) {
        return result;
      }

      if (result instanceof Error) {
        return NextResponse.json(
          {
            message: options.errorMsg ?? result.message,
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

      const response: Record<string, any> = {
        ...result,
        message: options.successMsg,
      };

      if (result.success) {
        response["message"] = options.successMsg;
        response["error"] = null;
      } else {
        response["message"] = options.errorMsg;
        response["data"] = null;
      }

      return NextResponse.json(response, { status: result.statusCode });
    } catch (err) {
      console.log("Uncaught Error ", err);
      if (err instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: options?.errorMsg ?? "Validation failed",
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
          message: options?.errorMsg ?? "Something went wrong!",
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
