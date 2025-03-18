"use client";

import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

export default function SignOut() {
  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: "/sign-in",
    });
  }, []);
  return <div className="absolute inset-0 bg-background z-50"></div>;
}