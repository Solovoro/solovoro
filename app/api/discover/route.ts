import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const useSample =
    process.env.USE_SAMPLE_PROVIDERS === '1' &&
    process.env.NODE_ENV !== 'production';

  const filename = useSample ? 'providers.sample.json' : 'providers.json';
  const filePath = path.resolve(process.cwd(), filename);

  const contents = await fs.readFile(filePath, 'utf8');
  const providers = JSON.parse(contents);

  return new Response(
    JSON.stringify({
      meta: { source: 'solovoro', lastUpdated: new Date().toISOString() },
      providers,
    }),
    {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    },
  );
}
