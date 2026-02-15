import { NextResponse } from 'next/server';

export async function GET() {
  const username = process.env.NEXT_PUBLIC_MAPBOX_USERNAME;
  const secretToken = process.env.MAPBOX_SECRET_TOKEN;

  if (!username || !secretToken) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  try {
    const url = `https://api.mapbox.com/tilesets/v1/${username}?access_token=${secretToken}&limit=5&sort=-modified`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();

    // Return the COMPLETE raw response from Mapbox
    return NextResponse.json({
      DEBUG_FULL_RAW_RESPONSE: data
    });

  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}