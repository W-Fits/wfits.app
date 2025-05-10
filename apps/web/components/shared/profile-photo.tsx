import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ProfilePhoto({
  src,
  username,
  className
}: {
  src: string | null
  username: string
  className?: string
}) {

  return (
    <Avatar className={cn(
      "w-24 h-24 border-2 border-border",
      className
    )}>
      <AvatarImage src={src ?? ""} alt={username} />
      <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
