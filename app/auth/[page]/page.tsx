import { AuthView } from "@neondatabase/auth/react";

export const dynamicParams = false;

export default function LoginPage() {
  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Brand New Login</h1>
      <AuthView
        path="login"                   // Neon route
        view="SIGN_IN"                 // MUST be SIGN_IN to show social
        redirectTo="/account"          // after login
        socialLayout="vertical"             // layout for Google button
        className="w-full max-w-md"
        cardHeader={<h2 className="text-lg font-semibold">Welcome back!</h2>}
      />
    </main>
  );
}