import { NavBar } from "./nav-bar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Nav() {
  const session = await getServerSession(authOptions);

  const routes = [
    { href: "/", label: "Home" },
    { href: "/wardrobe", label: "Wardrobe" },
    { href: "/profile", label: "Profile" }
  ];

  return session && <NavBar routes={routes} session={session} />
}