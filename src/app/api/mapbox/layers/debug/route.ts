// app/api/mapbox/debug/route.ts

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
    const data = await response.json();

    // Return raw data + transformed data side by side
    const debug = data.map((tileset: { id: string; name?: string; type: string }) => {
      const idAfterDot = tileset.id.includes('.') ? tileset.id.split('.').pop()! : tileset.id;
      const afterSuffixRemoval = idAfterDot.replace(/-[a-z0-9]+$/i, '');
      
      return {
        raw_id: tileset.id,
        raw_name: tileset.name,
        step1_after_dot_split: idAfterDot,
        step2_after_suffix_removal: afterSuffixRemoval,
      };
    });

    return NextResponse.json(debug, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}