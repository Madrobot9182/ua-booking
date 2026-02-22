// components/searchActions.ts
"use server";

import { redirect } from "next/navigation";

export async function handleSearchRedirect(query: string) {
  if (query.trim()) {
    // This runs securely on the server, so redirect() works perfectly!
    redirect(`/dashboard/search${(query)}`);
  }
}