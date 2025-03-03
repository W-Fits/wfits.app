import { LogOut } from "lucide-react";
import Link from "next/link";

export default function Account() {
  return (
    <main className="p-2">
      <h1 className="pt-12">Account</h1>
      <Link
        className="flex items-center gap-2 text-sm w-fit text-background bg-primary rounded-md p-2"
        href="/auth/logout"
      >
        Log out
        <LogOut className="h-5 w-5" />
      </Link>
    </main>
  );
}