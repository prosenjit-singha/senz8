"use client";

import React, { cache } from "react";
import { localAPI } from "@/helpers/api.helpers";
import { IApiSuccessResponse } from "@/interfaces";
import { Session } from "@/lib/auth/auth.type";
import { signOut } from "@/lib/auth/auth.client";
import { useRouter } from "next/navigation";

interface SessionProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

type SessionProviderState = {
  data: null | Session;
  status: "uninitialized" | "loading" | "error" | "success";
};

const fetchSession = cache(() =>
  localAPI
    .get<IApiSuccessResponse<Session>>("/auth/session", {
      next: {
        tags: ["session"],
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("Failed to fetch session", err);
      return null;
    })
);

type SessionContextValue = SessionProviderState & {
  update: (session: Partial<Session> | null) => Promise<Session | null>;
};

const SessionProviderContext = React.createContext<SessionContextValue>({
  data: null,
  status: "uninitialized",
} as SessionContextValue);

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const router = useRouter();
  const [state, setState] = React.useState<SessionProviderState>({
    data: null,
    status: "uninitialized",
  });

  React.useEffect(() => {
    setState({
      ...state,
      status: "loading",
    });
    fetchSession().then((session) => {
      if (session) {
        setState({
          data: session,
          status: "success",
        });
      } else {
        setState({
          data: null,
          status: "error",
        });
      }
    });
  }, []);

  const update = async (session: Partial<Session> | null) => {
    if (session == null) {
      await signOut().catch((err) => {
        console.log("Failed to sign out", err);
      });
      setState({
        data: null,
        status: "success",
      });
      router.push("/auth/sign-in");
      return null;
    }

    setState({
      ...state,
      status: "loading",
    });
    const res = await localAPI
      .put<IApiSuccessResponse<Session>>("/auth/session", session, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data) {
          setState({
            data: res.data,
            status: "success",
          });
        }
        // invalid session
        return res.data;
      })
      .catch((err) => {
        console.log("Failed to update session", err);
        setState({
          ...state,
          status: "success",
        });
        return null;
      });
    return res;
  };

  return (
    <SessionProviderContext.Provider value={{ ...state, update }}>
      {children}
    </SessionProviderContext.Provider>
  );
};

export const useSession = () => React.useContext(SessionProviderContext);
