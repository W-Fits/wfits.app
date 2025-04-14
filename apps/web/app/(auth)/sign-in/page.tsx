"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import credentialsSignIn from "@/lib/actions/credentials-sign-in";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [identifier, setIdentifier] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!identifier) throw new Error("No username or email supplied");
      if (!password) throw new Error("No password supplied");

      const promise = credentialsSignIn(identifier, password);

      toast.promise(promise, {
        loading: "Signing in...",
        success: "Signed in!",
        error: "Couldn't sign in"
      });

      await promise;
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.warning(String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex h-screen w-screen items-center justify-center flex-col gap-2">
      <Card className="min-w-[80%] sm:min-w-[40%]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid gap-4">
          <div className="grid gap-2">
            <Label>Username or Email</Label>
            <Input
              id="identifier"
              placeholder="email@example.com"
              type="text"
              value={identifier ?? ""}
              onChange={(e) => setIdentifier(e.currentTarget.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              id="password"
              type="password"
              value={password ?? ""}
              onChange={(e) => setPassword(e.currentTarget.value)}
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading || !identifier || !password}
            type="submit"
          >
            {loading ? <Spinner /> : "Sign in"}
          </Button>
        </CardContent>
      </Card>
      <div>
        <span className="text-sm text-foreground">
          Don&apos;t have a account?&nbsp;
          <Link
            className="font-semibold hover:underline decoration-foreground transition"
            href={"/sign-up"}
          >
            Sign up
          </Link>
        </span>
      </div>
    </section>
  );
}