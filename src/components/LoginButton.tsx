"use client";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export function LoginButton() {
  return (
    <div className="flex gap-4">
      <LoginLink className="px-4 py-2 bg-blue-500 text-white rounded">Login</LoginLink>
      <RegisterLink className="px-4 py-2 bg-green-500 text-white rounded">Register</RegisterLink>
    </div>
  );
}
