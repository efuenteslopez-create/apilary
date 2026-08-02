import * as fs from 'fs';
import * as path from 'path';
import { ApiRecord } from './types';
import seedData from '../../data/apis_seed.json';

let cachedApis: ApiRecord[] | null = null;

export function getLocalCatalog(): ApiRecord[] {
  if (cachedApis) {
    return cachedApis;
  }

  // Use imported seedData or read from disk
  try {
    cachedApis = (seedData as unknown as ApiRecord[]).map((api, index) => ({
      ...api,
      id: (api.id as string) || `local-api-${index + 1}`
    }));
    return cachedApis;
  } catch {
    // Fallback reading directly if json import had any issue
    const seedPath = path.join(process.cwd(), 'data', 'apis_seed.json');
    if (fs.existsSync(seedPath)) {
      const raw = fs.readFileSync(seedPath, 'utf-8');
      cachedApis = JSON.parse(raw).map((api: Partial<ApiRecord>, index: number) => ({
        ...api,
        id: api.id || `local-api-${index + 1}`
      })) as ApiRecord[];
      return cachedApis;
    }
  }

  return [];
}
