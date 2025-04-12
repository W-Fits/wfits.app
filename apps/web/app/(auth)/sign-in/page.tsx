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

export default function SignIn() {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <section className="flex h-screen w-screen items-center justify-center flex-col gap-2">
      <Card className="min-w-[80%] sm:min-w-[40%]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid gap-4">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              id="email"
              placeholder="email@example.com"
              type="email"
              value={email ?? ""}
              onChange={(e) => setEmail(e.currentTarget.value)}
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
            onClick={async () => {
              setLoading(true);

              toast.promise(credentialsSignIn(email!, password!), {
                loading: "Signing in...",
                success: "Signed in!",
                error: "Couldn't sign in"
              });

              setLoading(false);
            }}
            disabled={loading || !email || !password}
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