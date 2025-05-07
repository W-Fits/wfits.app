import { NavBar } from "./nav-bar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Home, PlusCircle, Search, Shirt, User } from "lucide-react";

export async function Nav() {
  const session = await getServerSession(authOptions);

  const routes = [
    { href: "/", icon: <Home className="w-6 h-6" /> },
    { href: "/search", icon: <Search className="w-6 h-6" /> },
    { href: "/create", icon: <PlusCircle className="w-6 h-6" /> },
    { href: "/wardrobe", icon: <Shirt className="w-6 h-6" /> },
    { href: "/profile", icon: <User className="w-6 h-6" /> }
  ];

  return session && <NavBar routes={routes} session={session} />
}