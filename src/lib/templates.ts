import { ApiRecord, CodeVariables, RenderedCodeSnippets } from './types';

export function getDefaultCodeVariables(api: ApiRecord): CodeVariables {
  const isPost = api.category === 'payments' || api.category === 'sms-notifications' || api.category === 'email' || api.category === 'ai-ml';
  const endpoint = api.base_url || `https://api.${api.slug}.com/v1`;

  let authTs = `headers: {
      'Authorization': \`Bearer \${process.env.${api.slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY}\`,
      'Content-Type': 'application/json'
    }`;
  let authPy = `headers = {
    "Authorization": f"Bearer {os.environ.get('${api.slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY')}",
    "Content-Type": "application/json"
}`;
  let authCurl = `-H "Authorization: Bearer $${api.slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY" \\\n  -H "Content-Type: application/json"`;

  if (api.auth_type === 'apiKey' && api.auth_header?.includes('X-Api-Key')) {
    authTs = `headers: {
      'X-Api-Key': process.env.${api.slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY || '',
      'Content-Type': 'application/json'
    }`;
    authPy = `headers = {
    "X-Api-Key": os.environ.get("${api.slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY", ""),
    "Content-Type": "application/json"
}`;
    authCurl = `-H "X-Api-Key: $${api.slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_API_KEY" \\\n  -H "Content-Type: application/json"`;
  } else if (api.auth_type === 'none') {
    authTs = `headers: {
      'Content-Type': 'application/json'
    }`;
    authPy = `headers = {
    "Content-Type": "application/json"
}`;
    authCurl = `-H "Content-Type: application/json"`;
  }

  return {
    endpoint_url: endpoint,
    http_method: isPost ? 'POST' : 'GET',
    auth_header_ts: authTs,
    auth_header_py: authPy,
    auth_header_curl: authCurl,
    type_definitions: `export interface ${capitalize(api.slug)}Response {\n  success: boolean;\n  data: Record<string, unknown>;\n  id?: string;\n  status?: string;\n}`,
    example_payload: isPost ? { sample_field: "value", timestamp: new Date().toISOString() } : {}
  };
}

function capitalize(s: string): string {
  return s.split(/[-_]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

export function generateTypeScriptSnippet(api: ApiRecord, customVars?: Partial<CodeVariables>): string {
  const vars = { ...getDefaultCodeVariables(api), ...customVars };
  const typeName = `${capitalize(api.slug)}Response`;
  const isPost = vars.http_method === 'POST';

  return `// Integration: ${api.name} (${api.category})
// Production-ready TypeScript implementation with strong typing

${vars.type_definitions}

export async function execute${capitalize(api.slug)}Request(payload?: Record<string, unknown>): Promise<${typeName}> {
  const response = await fetch('${vars.endpoint_url}', {
    method: '${vars.http_method}',
    ${vars.auth_header_ts}${isPost ? `,\n    body: JSON.stringify(payload || ${JSON.stringify(vars.example_payload, null, 6).replace(/\n/g, '\n    ')})` : ''}
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(\`[${api.name} Error \${response.status}]: \${errorBody}\`);
  }

  const data: ${typeName} = await response.json();
  return data;
}
`;
}

export function generatePythonSnippet(api: ApiRecord, customVars?: Partial<CodeVariables>): string {
  const vars = { ...getDefaultCodeVariables(api), ...customVars };
  const isPost = vars.http_method === 'POST';

  return `# Integration: ${api.name} (${api.category})
# Production-ready Python client using requests
import os
import requests
from typing import Dict, Any, Optional

def execute_${api.slug.replace(/[^a-zA-Z0-9]/g, '_')}_request(payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    url = "${vars.endpoint_url}"
    ${vars.auth_header_py.replace(/\n/g, '\n    ')}
    
    response = requests.request(
        method="${vars.http_method}",
        url=url,
        headers=headers${isPost ? `,\n        json=payload or ${JSON.stringify(vars.example_payload, null, 8).replace(/\n/g, '\n        ')}` : ''},
        timeout=10
    )
    
    response.raise_for_status()
    return response.json()
`;
}

export function generateCurlSnippet(api: ApiRecord, customVars?: Partial<CodeVariables>): string {
  const vars = { ...getDefaultCodeVariables(api), ...customVars };
  const isPost = vars.http_method === 'POST';

  return `# Integration: ${api.name}
curl -X ${vars.http_method} "${vars.endpoint_url}" \\
  ${vars.auth_header_curl}${isPost ? ` \\\n  -d '${JSON.stringify(vars.example_payload)}'` : ''}
`;
}

export function renderAllSnippets(api: ApiRecord, vars?: Partial<CodeVariables>): RenderedCodeSnippets {
  return {
    typescript: generateTypeScriptSnippet(api, vars),
    python: generatePythonSnippet(api, vars),
    curl: generateCurlSnippet(api, vars)
  };
}
