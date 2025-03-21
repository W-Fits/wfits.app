// app/api/auth/token/route.ts
import { NextResponse } from 'next/server';

async function getAccessToken(): Promise<string | null> {
  const tokenURL = `${process.env.AUTH0_DOMAIN}/oauth/token`;
  try {
    const response = await fetch(tokenURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
}

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: 'Failed to obtain access token' }, { status: 500 });
  }
  return NextResponse.json({ access_token: accessToken });
}
