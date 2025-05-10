import { signIn, SignInOptions } from "next-auth/react";

export async function credentialsSignIn(
  identifier: string,
  password: string,
) {
  const options = {
    redirect: false,
    callbackUrl: "/",
    password: password,
  } as SignInOptions;

  if (identifier.includes("@")) {
    options.email = identifier;
  } else {
    options.username = identifier;
  }

  const response = await signIn("credentials", options);

  if (!response || !response.ok) throw new Error("Error logging in.");

  return response;
}