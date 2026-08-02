-- ═══════════════════════════════════════════════════════════════
-- APILARY DATABASE MIGRATION
-- Tables: apis, queries, feedback
-- ═══════════════════════════════════════════════════════════════

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. APIS CATALOG TABLE
CREATE TABLE IF NOT EXISTS apis (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    description     TEXT NOT NULL,
    category        TEXT NOT NULL,
    keywords        TEXT[] NOT NULL DEFAULT '{}',
    website_url     TEXT,
    docs_url        TEXT,
    
    -- Technical Specifications
    api_type        TEXT DEFAULT 'REST',
    auth_type       TEXT,
    has_free_tier   BOOLEAN DEFAULT false,
    pricing_summary TEXT,
    sdk_languages   TEXT[] DEFAULT '{}',
    
    -- Template parameters
    base_url        TEXT,
    auth_header     TEXT,
    
    -- Metadata
    https           BOOLEAN DEFAULT true,
    cors            TEXT DEFAULT 'unknown',
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indices for rapid SQL filtering
CREATE INDEX IF NOT EXISTS idx_apis_category ON apis(category);
CREATE INDEX IF NOT EXISTS idx_apis_keywords ON apis USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_apis_slug ON apis(slug);

-- 2. QUERIES & ARCHITECTURE LOGS TABLE
CREATE TABLE IF NOT EXISTS queries (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_text          TEXT NOT NULL,
    selected_category   TEXT,
    candidate_ids       UUID[],
    recommended_ids     UUID[],
    architect_pick_id   UUID REFERENCES apis(id) ON DELETE SET NULL,
    response_payload    JSONB,
    model_used          TEXT DEFAULT 'google/gemini-2.5-flash',
    response_time_ms    INTEGER,
    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_queries_created_at ON queries(created_at DESC);

-- 3. USER FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id    UUID REFERENCES queries(id) ON DELETE CASCADE,
    is_useful   BOOLEAN NOT NULL,
    comment     TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_query_id ON feedback(query_id);

-- RLS POLICIES (Row Level Security)
ALTER TABLE apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow public read access to apis catalog
CREATE POLICY "Public APIs read access" ON apis FOR SELECT USING (true);

-- Allow public insert to queries log
CREATE POLICY "Public queries insert" ON queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public queries select" ON queries FOR SELECT USING (true);

-- Allow public insert to feedback
CREATE POLICY "Public feedback insert" ON feedback FOR INSERT WITH CHECK (true);
