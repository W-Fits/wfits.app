import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/sign-in");
  }
  return redirect(`/profile/${session.user.name}`);
}