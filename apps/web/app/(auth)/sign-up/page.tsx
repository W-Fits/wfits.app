"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { createUser } from "@/lib/actions/create-user";
import credentialsSignIn from "@/lib/actions/credentials-sign-in";

export default function SignUp() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async () => {
    setLoading(true);
    try {
      if (!password || !username || !email) throw new Error("Missing required input.");
      if (password.length < 8) throw new Error("Password too short.");

      const createUserPromise = createUser(username, password, email);

      toast.promise(createUserPromise, {
        loading: "Creating account...",
        success: "Account created succesfully!",
        error: "Error creating account"
      });

      await credentialsSignIn(email!, password!);

    } catch (error) {
      toast.warning(String(error));
    }
    setLoading(false);
  }

  return (
    <section className="flex h-screen w-screen items-center justify-center flex-col gap-2">
      <Card className="min-w-[80%] sm:min-w-[40%]">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create your account.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid gap-4">
          <div className="grid gap-2">
            <Label>Username</Label>
            <Input
              type="text"
              value={username ?? undefined}
              onChange={(e) => setUsername(e.currentTarget.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              placeholder="email@example.com"
              type="email"
              value={email ?? undefined}
              onChange={(e) => setEmail(e.currentTarget.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password ?? undefined}
              onChange={(e) => setPassword(e.currentTarget.value)}
              disabled={loading}
            />
          </div>
          <Button
            onClick={submit}
            disabled={loading || !email || !password || !username || password.length < 8}
          >
            {loading ? <Spinner /> : "Sign up"}
          </Button>
        </CardContent>
      </Card>
      <div>
        <span className="text-sm text-foreground">
          Already have an account?&nbsp;
          <Link
            className="font-semibold hover:underline decoration-foreground transition"
            href={"/sign-in"}
          >
            Sign in
          </Link>
        </span>
      </div>
    </section>
  );
}