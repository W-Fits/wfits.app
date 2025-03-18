import { signIn } from "next-auth/react";

export default async function credentialsSignIn(
  email: string,
  password: string,
) {
  const response = await signIn("credentials", {
    redirect: true,
    callbackUrl: "/",
    email: email,
    password: password,
  });

  if (!response || !response.ok) throw new Error("Error logging in");

  return response;
}