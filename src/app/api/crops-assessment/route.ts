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

type CropFeature = {
  type: 'Feature'
  geometry: CropGeometry
  properties: Record<string, string | number>
}

type CropFeatureCollection = {
  type: 'FeatureCollection'
  features: CropFeature[]
}

const CSV_PATH = path.join(process.cwd(), 'src/app/data-portal/Field_Crop_Recommendations.csv')

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

const getMarkerPoint = (geometry: CropGeometry): Position | null => {
  const outerRing =
    geometry.type === 'Polygon'
      ? geometry.coordinates[0]
      : geometry.coordinates[0]?.[0]

  if (!outerRing || !outerRing.length) return null

  let minLng = Number.POSITIVE_INFINITY
  let minLat = Number.POSITIVE_INFINITY
  let maxLng = Number.NEGATIVE_INFINITY
  let maxLat = Number.NEGATIVE_INFINITY

  outerRing.forEach(([lng, lat]) => {
    minLng = Math.min(minLng, lng)
    minLat = Math.min(minLat, lat)
    maxLng = Math.max(maxLng, lng)
    maxLat = Math.max(maxLat, lat)
  })

  if (![minLng, minLat, maxLng, maxLat].every(Number.isFinite)) return null
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2]
}

export async function GET() {
  try {
    const rawCsv = await fs.readFile(CSV_PATH, 'utf8')
    const rows = parseCSV(rawCsv.replace(/^\uFEFF/, ''))
    if (!rows.length) return NextResponse.json({ type: 'FeatureCollection', features: [] })

    const header = rows[0]
    const rowValues = rows.slice(1)
    const wktIndex = header.indexOf('WKT')

    const features: CropFeature[] = []
    const cropValues = new Set<string>()

    rowValues.forEach(values => {
      if (!values.length || !header.length) return

      const properties: Record<string, string | number> = {}
      header.forEach((col, index) => {
        if (!col || col === 'WKT') return
        const value = (values[index] || '').trim()
        properties[col] = value
      })

      const wkt = values[wktIndex] || ''
      const geometry = parseWKT(wkt)
      if (!geometry) return

      const markerPoint = getMarkerPoint(geometry)
      if (markerPoint) {
        properties.marker_lng = markerPoint[0]
        properties.marker_lat = markerPoint[1]
      }

      ;['Primary_Crop', 'Secondary_Crop', 'Kharif_Recommendation', 'Rabi_Recommendation'].forEach(key => {
        const cropValue = properties[key]
        if (typeof cropValue === 'string' && cropValue.trim()) {
          cropValues.add(cropValue.trim())
        }
      })

      features.push({
        type: 'Feature',
        geometry,
        properties
      })
    })

    const payload: CropFeatureCollection & {
      cropValues: string[]
      availableSymbologyFields: string[]
    } = {
      type: 'FeatureCollection',
      features,
      cropValues: Array.from(cropValues).sort((a, b) => a.localeCompare(b)),
      availableSymbologyFields: ['Primary_Crop', 'Secondary_Crop', 'Kharif_Recommendation', 'Rabi_Recommendation']
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Failed to serve crops assessment data', error)
    return NextResponse.json({ error: 'Failed to read crops assessment data' }, { status: 500 })
  }
}
