import { auth0 } from "@/lib/auth0";
import Image from "next/image";
import Link from "next/link";
import { LogIn, User as UserIcon } from "lucide-react";


export async function Nav() {
  const session = await auth0.getSession();

  console.log(session);

  return (
    <header className="flex backdrop-blur-md bg-opacity-10 backdrop-filter shadow-sm fixed top-0 w-full z-50">
      <nav className="flex grow px-2 py-1 justify-between items-center mx-auto md:max-w-4xl">
        <Link
          className="h-10 w-10"
          href="/"
        >
          <Image
            src="/icon"
            className="w-full"
            alt="Home Icon"
            width={100}
            height={100}
            priority
          />
        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <Link
              className="flex h-10 w-10 items-center justify-center bg-muted rounded-full"
              href="/account"
            >
              <UserIcon className="h-6 w-6 text-muted-foreground" />
            </Link>
          ) : (
            <a
              className="flex h-10 w-10 items-center justify-center bg-muted rounded-full"
              href="/auth/login"
            >
              <LogIn className="h-6 w-6 text-muted-foreground" />
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}