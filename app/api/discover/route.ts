import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

exportt const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function loadProviders() {
  const useSample = process.env.USE_SAMPLE_PROVIDERS === '1' && process.env.NODE_ENV !== 'production';
  const fileName = useSample ? 'providers.sample.json' : 'providers.json';
  const filePath = path.join(process.cwd(), fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function GET() {
  const providers = await loadProviders();
  const meta = { source: 'solovoro', lastUpdated: new Date().toISOString() };
  const body = { meta, providers };
  return NextResponse.json(body, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
    },
  });
}
