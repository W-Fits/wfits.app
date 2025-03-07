import { User } from "@auth0/nextjs-auth0/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

export function AccountNav({ user }: { user?: User }) {
  if (!user) return null;

  return (
    <Avatar>
      <AvatarImage src={user.picture} />
      <AvatarFallback>
        <UserIcon className="w-6 h-6" />
      </AvatarFallback>
    </Avatar>
  );
}