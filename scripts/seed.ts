import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { ApiRecord } from '../src/lib/types';

// Load .env.local if present
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim();
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function runSeed() {
  console.log('🚀 Apilary Seed Script: Ingesting curated APIs into Supabase...');

  const seedFilePath = path.join(__dirname, '..', 'data', 'apis_seed.json');
  if (!fs.existsSync(seedFilePath)) {
    console.error(`❌ Seed file not found at ${seedFilePath}. Run 'tsx scripts/generate-dataset.ts' first.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(seedFilePath, 'utf-8');
  const apis: Omit<ApiRecord, 'id' | 'created_at'>[] = JSON.parse(rawData);

  console.log(`📦 Loaded ${apis.length} APIs from seed dataset.`);

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseUrl.includes('placeholder')) {
    console.log('\n⚠️  Supabase is not configured yet with live credentials in .env.local.');
    console.log('💡 Note: Apilary includes an automatic in-memory catalog fallback for local testing.');
    console.log('   To connect to a real database:');
    console.log('   1. Execute `supabase/migrations/20260802_init.sql` in your Supabase SQL Editor.');
    console.log('   2. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.');
    console.log('   3. Re-run `npm run seed`.\n');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('📡 Connecting to Supabase and upserting records...');

  // Upsert in batches of 50
  const batchSize = 50;
  for (let i = 0; i < apis.length; i += batchSize) {
    const batch = apis.slice(i, i + batchSize);
    const { error } = await supabase
      .from('apis')
      .upsert(batch, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`✅ Inserted batch ${i / batchSize + 1} (${Math.min(i + batchSize, apis.length)}/${apis.length})`);
    }
  }

  console.log('🎉 Seed completed successfully!');
}

runSeed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
