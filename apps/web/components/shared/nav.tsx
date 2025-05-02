import { NavBar } from "./nav-bar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Home, Shirt, User } from "lucide-react";

export async function Nav() {
  const session = await getServerSession(authOptions);

  const routes = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/wardrobe", label: "Wardrobe", icon: <Shirt className="w-5 h-5" /> },
    { href: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> }
  ];

  return session && <NavBar routes={routes} session={session} />
}