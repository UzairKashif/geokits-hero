import { NextResponse } from 'next/server';

const formatTilesetName = (name: string): string => {
  // 1. Remove the Mapbox suffix (hyphen + alphanumeric at the end)
  let formatted = name.replace(/-[a-z0-9]+$/i, '');

  // 2. Apply specific transformations for your WFP layers
  formatted = formatted
    // Mangrove time series: "Lasbela_MangroveMask_MVI_2025" → "Lasbela Mangrove Cover 2025"
    .replace(/^(.+?)_MangroveMask_MVI_(\d{4})$/, '$1 Mangrove Cover $2')
    // Gain/Loss: "Lasbela_Mangrove_GAIN_2000_20" → "Lasbela Mangrove Gain (2000-2020)"
    .replace(/^(.+?)_Mangrove_GAIN_(\d{4})_(\d{2})$/, '$1 Mangrove Gain ($2-20$3)')
    .replace(/^(.+?)_Mangrove_LOSS_(\d{4})_(\d{2})$/, '$1 Mangrove Loss ($2-20$3)')
    // Proximity layers: "FreshwaterProximity_Lasbela" → "Lasbela Freshwater Proximity"
    .replace(/^FreshwaterProximity_(.+)$/, '$1 Freshwater Proximity')
    .replace(/^MangroveProximity_(.+)$/, '$1 Mangrove Proximity')
    // Suitability layers
    .replace(/ClimateSuitability/, 'Climate Suitability')
    .replace(/TidalSuitability/, 'Tidal Suitability')
    .replace(/^CalculatedSuitability$/, 'Agricultural Suitability Index')
    // Technical layers
    .replace(/JRCWaterOccurrence/, 'JRC Water Occurrence')
    .replace(/_DEM$/, ' Digital Elevation Model')
    .replace(/_LST$/, ' Land Surface Temperature')
    // Clean up any remaining underscores
    .replace(/_/g, ' ');

  return formatted;
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

    const layers = data.map((tileset: { id: string; name: string; type: string; center?: number[] }) => ({
      id: tileset.id,
      name: formatTilesetName(tileset.name),  // Use tileset.name, not tileset.id
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