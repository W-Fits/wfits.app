// app/api/auth/token/route.ts
import { getAccessToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: 'Failed to obtain access token' }, { status: 500 });
  }
  return NextResponse.json({ access_token: accessToken });
}
