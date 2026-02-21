import { auth } from "@/lib/auth/server";
import CalendarDemo from "@/components/calendar-demo";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
export default async function SplashPage() {
  // const session = await auth.getSession();
  // if (!session) redirect("/auth/login");
  
  return (
    <div>
      <h1>WELECOME TO OUR WEBSITE</h1>
      <h2>Quirky long description about our existance!</h2>
      <h3>
        {" "}
        button here. Check if session exist, login or redirect to /dashboard
      </h3>
      <Link href={`/dashboard/search`}>
        <Button>Search</Button>
      </Link>
      
      <CalendarDemo />
    </div>
  );
}
