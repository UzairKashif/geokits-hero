import { NextResponse } from 'next/server';

export async function GET() {
  const username = process.env.NEXT_PUBLIC_MAPBOX_USERNAME;
  const secretToken = process.env.MAPBOX_SECRET_TOKEN;

  if (!username || !secretToken) {
    console.error("❌ Missing Mapbox credentials in .env.local");
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  try {
    const url = `https://api.mapbox.com/tilesets/v1/${username}?access_token=${secretToken}&limit=50&sort=-modified`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Mapbox API Error (${response.status}): ${errorText}`);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();

    // TEMPORARY DEBUG: Return raw + transformed for first 3 items
    const debugLayers = data.slice(0, 3).map((tileset: { id: string; name?: string; type: string; center?: number[] }) => {
      const step1 = tileset.id;
      const step2 = tileset.id.includes('.') ? tileset.id.split('.').pop()! : tileset.id;
      const step3 = step2.replace(/-[a-z0-9]+$/i, '');
      
      return {
        DEBUG_raw_id: step1,
        DEBUG_after_split: step2,
        DEBUG_after_suffix_removal: step3,
        id: tileset.id,
        name: step3.replace(/_/g, ' '),
        type: tileset.type,
        center: tileset.center,
        sourceUrl: `mapbox://${tileset.id}`
      };
    });

    return NextResponse.json(debugLayers);

  } catch (error: unknown) {
    console.error('❌ Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}