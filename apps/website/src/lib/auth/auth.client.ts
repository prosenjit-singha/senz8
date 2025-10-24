import { localAPI } from "@/helpers/api.helpers";

export const signIn = (body: { email: string; password: string }) =>
  localAPI.post("/auth/sign-in", body);

export const signOut = (callbackUrl?: string) =>
  localAPI.delete(`/auth/session${callbackUrl ? `?callbackURL=${callbackUrl}` : ""}`);
