"use client";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <KindeProvider>{children}</KindeProvider>
);