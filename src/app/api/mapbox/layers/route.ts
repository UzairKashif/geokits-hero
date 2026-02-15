import { NextResponse } from 'next/server';

// Explicit display names for important layers (highest priority)
const DISPLAY_NAMES: Record<string, string> = {
  // Add any layers where you want exact control over the name
  // 'uzairkashif27.some_specific_id': 'Exact Name You Want',
};

// Smart formatter that handles your naming patterns
const formatTilesetName = (id: string, originalName?: string): string => {
  // 1. Check explicit mapping first
  if (DISPLAY_NAMES[id]) return DISPLAY_NAMES[id];

  // 2. Get the part after the username (e.g., "Lasbela_MangroveMask_MVI_2025-2pg...")
  let name = id.split('.').pop() || id;

  // 3. Remove the Mapbox-generated suffix (the random characters after the last hyphen)
  //    Pattern: -[alphanumeric]{5,} at the end
  name = name.replace(/-[a-z0-9]{5,}$/i, '');

  // 4. Handle specific patterns in your data
  name = name
    // MVI years: "MangroveMask_MVI_2025" → "Mangrove Cover 2025"
    .replace(/MangroveMask_MVI_(\d{4})/, 'Mangrove Cover $1')
    // Gain/Loss: "Mangrove_GAIN_2000_20" → "Mangrove Gain (2000-2020)"
    .replace(/Mangrove_GAIN_(\d{4})_(\d{2})/, 'Mangrove Gain ($1-20$2)')
    .replace(/Mangrove_LOSS_(\d{4})_(\d{2})/, 'Mangrove Loss ($1-20$2)')
    // Proximity layers
    .replace(/FreshwaterProximity/, 'Freshwater Proximity')
    .replace(/MangroveProximity/, 'Mangrove Proximity')
    // Suitability layers
    .replace(/CalculatedSuitability/, 'Agricultural Suitability')
    .replace(/ClimateSuitability/, 'Climate Suitability')
    // Clean up remaining underscores and add proper spacing
    .replace(/_/g, ' ')
    // Add space before district names if stuck together
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Clean up any double spaces
    .replace(/\s+/g, ' ')
    .trim();

  // 5. Title case any remaining words (but preserve existing caps like "MVI")
  name = name.replace(/\b[a-z]/g, c => c.toUpperCase());

  return name;
};

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

    const layers = data.map((tileset: { id: string; name?: string; type: string; center?: number[] }) => ({
      id: tileset.id,
      name: formatTilesetName(tileset.id, tileset.name),
      type: tileset.type,
      center: tileset.center,
      sourceUrl: `mapbox://${tileset.id}`
    }));

    return NextResponse.json(layers);

  } catch (error: unknown) {
    console.error('❌ Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}