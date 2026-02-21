"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { Link, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

type LogoutButtonProps = {
  label?: string;
  redirectTo?: string;
};

export default function LogoutButton({
  label = "Logout",
  redirectTo = "/",
}: LogoutButtonProps) {
    
  const handleLogout = async () => {
    await authClient.signOut({}); // use authClient, not hook  };
    redirect('/')
  };

  return (
    <Button
      onClick={handleLogout}
      size="lg"
      className="rounded-2xl bg-red-600 text-white hover:bg-red-500"
    >
      <LogOut className="w-4 h-4">{label}</LogOut>
    </Button>
  );
}
