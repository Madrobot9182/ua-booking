"use client";

import { SignIn } from "@neondatabase/auth/react";

export default function LoginButton() {
  return (
    <button onClick={() => SignIn("google")}>
      Sign in with Google
    </button>
  );
}