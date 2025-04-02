import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    AUTH_SECRET: z.string().min(1),
    APP_BASE_URL: z.string().url(),
    AUTH0_AUDIENCE: z.string().url(),
    AUTH0_DOMAIN: z.string().url(),
    AUTH0_CLIENT_ID: z.string().min(1),
    AUTH0_CLIENT_SECRET: z.string().min(1)

  },
  clientPrefix: "NEXT_PUBLIC",
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});