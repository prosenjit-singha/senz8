import "server-only";

import type { Session } from "./auth.type";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCustomer,
  renewToken,
  revokeToken,
} from "../shopify/shopify.customer.service";
import { addDays } from "date-fns";
import { revalidateTag } from "next/cache";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encryptSession(payload: Session) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expiredAt ? new Date(payload.expiredAt) : "1hr")
    .sign(key);
}

export async function decryptSession(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify<Session & JWTPayload>(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(
  sessionPayload: Session,
  redirectURL?: string
) {
  const expiresAt = sessionPayload.expiredAt
    ? new Date(sessionPayload.expiredAt)
    : addDays(new Date(), 7);
  const session = await encryptSession(sessionPayload);

  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/", // The cookie will be sent by the browser on every request to your domain, regardless of the path.
  });

  revalidateTag("session");

  if (redirectURL) {
    redirect(redirectURL);
  } else {
    return sessionPayload;
  }
}

export async function getSession() {
  const cookieStorage = await cookies();
  const cookie = cookieStorage.get("session")?.value;
  if (!cookie) return null;
  return decryptSession(cookie);
}

export async function verifySession(errorRedirectURL?: string) {
  const session = await getSession();

  if (!session) {
    if (errorRedirectURL) {
      redirect(errorRedirectURL);
    }
    return null;
  }
  // in-depth verification role base
  if (session.user.role === "customer") {
    const customer = await getCustomer(session.accessToken);

    return session;
  }

  return session;
}

export async function updateSession(newSession: Partial<Session> | null) {
  const oldSession = await getSession();

  if (!oldSession) {
    return null;
  }
  if (newSession == null) {
    await deleteSession();
  }

  const newEncryptedSession = await encryptSession({
    ...oldSession,
    ...newSession,
  });

  const expires = newSession?.expiredAt
    ? new Date(newSession.expiredAt)
    : new Date(oldSession.expiredAt);

  const cookieStorage = await cookies();
  cookieStorage.set("session", newEncryptedSession, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });

  revalidateTag("session");

  return newSession;
}

export async function renewSession() {
  const cookieStorage = await cookies();
  const cookie = cookieStorage.get("session")?.value;

  if (cookie) {
    const session = await decryptSession(cookie);
    if (session && session.accessToken) {
      const { customerAccessTokenRenew } = await renewToken(
        session.accessToken
      );
      // set the session
      if (customerAccessTokenRenew?.customerAccessToken) {
        const newSession: Session = {
          user: session.user,
          accessToken:
            customerAccessTokenRenew?.customerAccessToken.accessToken,
          expiredAt: customerAccessTokenRenew?.customerAccessToken.expiresAt,
        };
        await updateSession(newSession);
        return newSession;
      }
    }
    revalidateTag("session");
    return null;
  } else {
    return null;
  }
}

export async function deleteSession(redirectURL?: string) {
  const session = await getSession();
  if (session) {
    if (session.user.role === "customer") {
      const result = await revokeToken(session.accessToken);
      console.log("Revoke token result", result);
    }
  }
  const cookieStorage = await cookies();
  cookieStorage.delete("session");
  revalidateTag("session");
  if (redirectURL) {
    redirect(redirectURL);
  }
}
