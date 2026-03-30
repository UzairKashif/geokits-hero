import { NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'

type Position = [number, number]

type PolygonGeometry = {
  type: 'Polygon'
  coordinates: Position[][]
}

type MultiPolygonGeometry = {
  type: 'MultiPolygon'
  coordinates: Position[][][]
}

type CropGeometry = PolygonGeometry | MultiPolygonGeometry

type CropProperties = Record<string, string | number>

type CropFeature = {
  type: 'Feature'
  id?: string | number
  geometry: CropGeometry
  properties: CropProperties
}

type CropFeatureCollection = {
  type: 'FeatureCollection'
  features: CropFeature[]
}

type CropSuitabilityRow = {
  crop: string
  score: number | null
  classification: string
}

type RecommendationRow = {
  label: string
  crop: string
  score: number | null
}

type SeasonalRecommendationRow = {
  season: string
  best: string
  bestScore: number | null
  second: string
  secondScore: number | null
}

const CSV_PATH = path.join(process.cwd(), 'src/app/data-portal/Field_Crop_Suitability_v3_with_wkt.csv')

const parseCSV = (csvText: string): string[][] => {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < csvText.length; i += 1) {
    const ch = csvText[i]

    if (inQuotes) {
      if (ch === '"') {
        if (csvText[i + 1] === '"') {
          field += '"'
          i += 1
          continue
        }
        inQuotes = false
        continue
      }

      field += ch
      continue
    }

    if (ch === '"') {
      inQuotes = true
      continue
    }

    if (ch === ',') {
      row.push(field)
      field = ''
      continue
    }

    if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      continue
    }

    if (ch !== '\r') {
      field += ch
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

const extractGroupsByDepth = (input: string, targetDepth: number): string[] => {
  const groups: string[] = []
  let depth = 0
  let start = -1

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]

    if (ch === '(') {
      depth += 1
      if (depth === targetDepth) {
        start = i + 1
      }
      continue
    }

    if (ch === ')') {
      if (depth === targetDepth && start >= 0) {
        groups.push(input.slice(start, i).trim())
        start = -1
      }
      depth -= 1
    }
  }

  return groups
}

const parseRing = (ringText: string): Position[] => {
  const points = ringText
    .split(',')
    .map(pair => pair.trim())
    .filter(Boolean)
    .map(pair => {
      const [lngText, latText] = pair.split(/\s+/)
      const lng = Number(lngText)
      const lat = Number(latText)
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null
      return [lng, lat] as Position
    })
    .filter((coord): coord is Position => coord !== null)

  if (points.length < 3) return []

  const [firstLng, firstLat] = points[0]
  const [lastLng, lastLat] = points[points.length - 1]
  if (firstLng !== lastLng || firstLat !== lastLat) {
    points.push([firstLng, firstLat])
  }

  return points
}

const parseWKT = (wktValue: string): CropGeometry | null => {
  const wkt = wktValue.trim()
  if (!wkt) return null

  if (/^POLYGON\s*\(/i.test(wkt)) {
    const body = wkt.replace(/^POLYGON\s*/i, '').trim()
    const rings = extractGroupsByDepth(body, 2)
      .map(parseRing)
      .filter(ring => ring.length >= 4)

    if (!rings.length) return null
    return { type: 'Polygon', coordinates: rings }
  }

  if (/^MULTIPOLYGON\s*\(/i.test(wkt)) {
    const body = wkt.replace(/^MULTIPOLYGON\s*/i, '').trim()
    const polygonBodies = extractGroupsByDepth(body, 2)

    const polygons = polygonBodies
      .map(polygonBody =>
        extractGroupsByDepth(polygonBody, 1)
          .map(parseRing)
          .filter(ring => ring.length >= 4)
      )
      .filter(polygon => polygon.length > 0)

    if (!polygons.length) return null
    return { type: 'MultiPolygon', coordinates: polygons }
  }

  return null
}

const toNumber = (value: string): number | null => {
  const trimmed = value.trim()
  if (!trimmed) return null

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

const humanizeCropName = (value: string) =>
  value
    .replace(/^Suit_/, '')
    .replace(/^Class_/, '')
    .replace(/_/g, ' ')
    .trim()

const getValue = (rowMap: Record<string, string>, key: string) => (rowMap[key] || '').trim()

const stringify = (value: unknown) => JSON.stringify(value)

const buildCropSuitability = (headers: string[], rowMap: Record<string, string>): CropSuitabilityRow[] =>
  headers
    .filter(header => header.startsWith('Suit_'))
    .map(header => {
      const crop = humanizeCropName(header)
      const classKey = `Class_${header.replace(/^Suit_/, '')}`
      return {
        crop,
        score: toNumber(getValue(rowMap, header)),
        classification: getValue(rowMap, classKey)
      }
    })
    .sort((a, b) => (b.score ?? -Infinity) - (a.score ?? -Infinity))

const buildRankedRecommendations = (rowMap: Record<string, string>, prefix: string): RecommendationRow[] =>
  [1, 2, 3]
    .map(rank => ({
      label: `Rank ${rank}`,
      crop: getValue(rowMap, `${prefix}_${rank}`),
      score: toNumber(getValue(rowMap, `${prefix}_${rank}_Score`))
    }))
    .filter(item => item.crop)

const buildRawRecommendations = (rowMap: Record<string, string>): RecommendationRow[] =>
  [1, 2, 3]
    .map(rank => ({
      label: `Rank ${rank}`,
      crop: getValue(rowMap, `Rec_Crop_${rank}`),
      score: toNumber(getValue(rowMap, `Rec_Score_${rank}`))
    }))
    .filter(item => item.crop)

const buildSeasonalRecommendations = (rowMap: Record<string, string>): SeasonalRecommendationRow[] => [
  {
    season: 'Rabi',
    best: getValue(rowMap, 'Best_Rabi'),
    bestScore: toNumber(getValue(rowMap, 'Best_Rabi_Score')),
    second: getValue(rowMap, 'Second_Rabi'),
    secondScore: toNumber(getValue(rowMap, 'Second_Rabi_Score'))
  },
  {
    season: 'Kharif',
    best: getValue(rowMap, 'Best_Kharif'),
    bestScore: toNumber(getValue(rowMap, 'Best_Kharif_Score')),
    second: getValue(rowMap, 'Second_Kharif'),
    secondScore: toNumber(getValue(rowMap, 'Second_Kharif_Score'))
  },
  {
    season: 'Perennial',
    best: getValue(rowMap, 'Best_Perennial'),
    bestScore: toNumber(getValue(rowMap, 'Best_Perennial_Score')),
    second: getValue(rowMap, 'Second_Perennial'),
    secondScore: toNumber(getValue(rowMap, 'Second_Perennial_Score'))
  }
]

export async function GET() {
  try {
    const rawCsv = await fs.readFile(CSV_PATH, 'utf8')
    const rows = parseCSV(rawCsv.replace(/^\uFEFF/, ''))
    if (!rows.length) {
      return NextResponse.json({ type: 'FeatureCollection', features: [], topTierCrops: [] })
    }

    const headers = rows[0]
    const valuesRows = rows.slice(1)
    const topTierCrops = new Set<string>()
    const features: CropFeature[] = []

    valuesRows.forEach(values => {
      if (!values.length) return

      const rowMap = headers.reduce<Record<string, string>>((acc, header, index) => {
        acc[header] = values[index] || ''
        return acc
      }, {})

      const geometry = parseWKT(getValue(rowMap, 'geometry_wkt'))
      if (!geometry) return

      const fieldId = getValue(rowMap, 'fid') || getValue(rowMap, 'system:inde') || String(features.length + 1)
      const fieldUid = getValue(rowMap, 'system:inde')
      const areaM2 = toNumber(getValue(rowMap, 'Field_Area_m2')) ?? toNumber(getValue(rowMap, 'Area_m2'))
      const topRecommendations = buildRankedRecommendations(rowMap, 'TierRec')
      const rawRecommendations = buildRawRecommendations(rowMap)
      const seasonalRecommendations = buildSeasonalRecommendations(rowMap)
      const cropSuitability = buildCropSuitability(headers, rowMap)
      const topCrop = topRecommendations[0]?.crop || rawRecommendations[0]?.crop || cropSuitability[0]?.crop || ''
      const topCropScore = topRecommendations[0]?.score ?? rawRecommendations[0]?.score ?? cropSuitability[0]?.score

      if (topCrop) {
        topTierCrops.add(topCrop)
      }

      const properties: CropProperties = {
        field_id: fieldId,
        field_uid: fieldUid,
        area_m2: areaM2 ?? '',
        area_ha: areaM2 ? Number((areaM2 / 10000).toFixed(2)) : '',
        top_crop: topCrop,
        top_crop_score: topCropScore ?? '',
        water_tier: getValue(rowMap, 'Water_Tier'),
        limiting_factor: getValue(rowMap, 'Limiting_Factor'),
        limiting_score: toNumber(getValue(rowMap, 'Limiting_Score')) ?? '',
        tier_limiting_crop: getValue(rowMap, 'Tier_Limiting_Crop'),
        tier_limiting_score: toNumber(getValue(rowMap, 'Tier_Limiting_Score')) ?? '',
        best_rabi: getValue(rowMap, 'Best_Rabi'),
        best_rabi_score: toNumber(getValue(rowMap, 'Best_Rabi_Score')) ?? '',
        second_rabi: getValue(rowMap, 'Second_Rabi'),
        second_rabi_score: toNumber(getValue(rowMap, 'Second_Rabi_Score')) ?? '',
        best_kharif: getValue(rowMap, 'Best_Kharif'),
        best_kharif_score: toNumber(getValue(rowMap, 'Best_Kharif_Score')) ?? '',
        second_kharif: getValue(rowMap, 'Second_Kharif'),
        second_kharif_score: toNumber(getValue(rowMap, 'Second_Kharif_Score')) ?? '',
        best_perennial: getValue(rowMap, 'Best_Perennial'),
        best_perennial_score: toNumber(getValue(rowMap, 'Best_Perennial_Score')) ?? '',
        second_perennial: getValue(rowMap, 'Second_Perennial'),
        second_perennial_score: toNumber(getValue(rowMap, 'Second_Perennial_Score')) ?? '',
        rotation_strategy: getValue(rowMap, 'Rotation_Strategy'),
        tier_recommendations_json: stringify(topRecommendations),
        raw_recommendations_json: stringify(rawRecommendations),
        seasonal_recommendations_json: stringify(seasonalRecommendations),
        crop_suitability_json: stringify(cropSuitability)
      }

      features.push({
        type: 'Feature',
        id: fieldId,
        geometry,
        properties
      })
    })

    const payload: CropFeatureCollection & { topTierCrops: string[] } = {
      type: 'FeatureCollection',
      features,
      topTierCrops: Array.from(topTierCrops).sort((a, b) => a.localeCompare(b))
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Failed to serve crops assessment data', error)
    return NextResponse.json({ error: 'Failed to read crops assessment data' }, { status: 500 })
  }
}
