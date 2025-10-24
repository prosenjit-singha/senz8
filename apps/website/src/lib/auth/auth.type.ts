export type Session = {
  user: {
    id: string;
    email: string;
    displayName: string;
    phone?: string;
    role: "customer";
  };
  accessToken: string;
  /** ISO string */
  expiredAt: string;
};
