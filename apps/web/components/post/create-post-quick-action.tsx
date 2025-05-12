import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function CreatePostQuickAction({
  className
}: {
  className?: string;
}) {
  return (
    <Link className={className} href="/create/post">
      <div className="border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer h-full bg-gradient-to-br from-teal-50 to-transparent dark:from-teal-950/20 dark:to-transparent">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-teal-100 dark:bg-blue-900/30 p-2">
            <PlusCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="font-medium">Create New Post</h3>
            <p className="text-sm text-muted-foreground">Create a new post for your profile</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
