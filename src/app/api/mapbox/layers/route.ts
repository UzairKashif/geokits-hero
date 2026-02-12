import { NextResponse } from 'next/server';

export async function GET() {
  const username = process.env.NEXT_PUBLIC_MAPBOX_USERNAME;
  const secretToken = process.env.MAPBOX_SECRET_TOKEN;

  if (!username || !secretToken) {
    console.error("❌ Missing Mapbox credentials in .env.local");
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  try {
    // Fetch Tilesets (Vector & Raster/TIFF)
    const url = `https://api.mapbox.com/tilesets/v1/${username}?access_token=${secretToken}&limit=50&sort=-modified`;
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Mapbox API Error (${response.status}): ${errorText}`);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();

    // Transform for frontend
    const layers = data.map((tileset: { id: string; name?: string; type: string; center?: number[]; }) => ({
      id: tileset.id,
      name: tileset.name || tileset.id,
      type: tileset.type, // 'vector' or 'raster'
      center: tileset.center,
      sourceUrl: `mapbox://${tileset.id}`
    }));

    return NextResponse.json(layers);

  } catch (error: unknown) {
    console.error('❌ Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}