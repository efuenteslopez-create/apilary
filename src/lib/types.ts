/**
 * APILARY — Domain and Contract TypeScript Types
 */

export interface ApiRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  keywords: string[];
  website_url?: string;
  docs_url?: string;
  api_type?: 'REST' | 'GraphQL' | string;
  auth_type?: 'apiKey' | 'OAuth2' | 'Bearer' | 'none' | string;
  has_free_tier?: boolean;
  pricing_summary?: string;
  sdk_languages?: string[];
  base_url?: string;
  auth_header?: string;
  https?: boolean;
  cors?: 'yes' | 'no' | 'unknown' | string;
  created_at?: string;
}

export interface CodeVariables {
  endpoint_url: string;
  http_method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  auth_header_ts: string;
  auth_header_py: string;
  auth_header_curl: string;
  type_definitions: string;
  example_payload: Record<string, unknown> | unknown[];
}

export interface RenderedCodeSnippets {
  typescript: string;
  python: string;
  curl: string;
}

export interface RecommendedApi {
  api_id: string;
  api_name: string;
  tagline?: string;
  website_url?: string;
  docs_url?: string;
  why: string;
  pros: string[];
  cons: string[];
  pricing_evaluation: string;
  risk_level: 'low' | 'medium' | 'high';
  risk_note: string;
  code_variables?: CodeVariables;
  code_snippets: RenderedCodeSnippets;
}

export interface ComparisonMatrixItem {
  api_name: string;
  scores: string[]; // Corresponding to matrix dimensions
}

export interface ComparisonMatrix {
  dimensions: string[];
  api_evaluations: ComparisonMatrixItem[];
}

export interface ArchitectVerdict {
  selected_api_name: string;
  selected_api_id?: string;
  core_rationale: string;
  key_strengths: string[];
  primary_risks: string[];
  when_not_to_use: string;
}

export interface RecommendationRequest {
  query: string;
  locale?: 'en' | 'es';
}

export interface RecommendationResponse {
  query_id: string;
  understanding: string;
  recommendations: RecommendedApi[];
  comparison_matrix: ComparisonMatrix;
  architect_verdict: ArchitectVerdict;
  response_time_ms?: number;
}

export interface FeedbackPayload {
  query_id: string;
  is_useful: boolean;
  comment?: string;
}

export interface QueryRecord {
  id: string;
  query_text: string;
  selected_category?: string;
  candidate_ids?: string[];
  recommended_ids?: string[];
  architect_pick_id?: string;
  response_payload?: RecommendationResponse;
  model_used?: string;
  response_time_ms?: number;
  created_at?: string;
}
