'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthenticate } from "@neondatabase/auth/react";

type LoginButtonProps = {
  label?: string;
};

export default function LoginButton({ label = "Login" }: LoginButtonProps) {
  const router = useRouter();
  const auth = useAuthenticate();
  const { data, isPending } = auth;
  const session = data?.session;

  const handleLogin = () => {
    if (!session) {
      router.push("/auth/login"); // go to login if not logged in
    } else {
      router.push("/admin");      // go to admin if logged in
    }
  };

  // Wait for session to load
  if (isPending) return (
    <Button size="lg" disabled>
      Loading...
    </Button>
  );

  return (
    <Button
      onClick={handleLogin}
      size="lg"
      className="rounded-2xl bg-green-700 text-black hover:bg-green-600"
    >
      {label}
    </Button>
  );
}