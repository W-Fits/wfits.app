import { redirect } from 'next/navigation';

// TODO: Take request URL to give helpful 404 (suggest where they might be looking)

export default function NotFound() {
  return redirect("/");
}
