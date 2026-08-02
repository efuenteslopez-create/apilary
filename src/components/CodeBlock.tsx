'use client';

import React, { useState } from 'react';
import { RenderedCodeSnippets } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface CodeBlockProps {
  snippets: RenderedCodeSnippets;
  apiName: string;
}

type TabType = 'typescript' | 'python' | 'curl';

export default function CodeBlock({ snippets, apiName }: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState<TabType>('typescript');
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const activeCode = snippets[activeTab] || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.warn('Clipboard copy failed');
    }
  };

  return (
    <div style={{
      marginTop: '1.25rem',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-code)',
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden'
    }}>
      {/* Code Header Bar with Tabs and Copy */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.4rem 0.75rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {/* Language Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {(['typescript', 'python', 'curl'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
              style={{
                background: activeTab === tab ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: activeTab === tab ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                borderRadius: '4px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: activeTab === tab ? '#c7d2fe' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textTransform: tab === 'typescript' ? 'none' : tab === 'python' ? 'none' : 'uppercase'
              }}
            >
              {tab === 'typescript' ? 'TypeScript' : tab === 'python' ? 'Python' : 'cURL'}
            </button>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          aria-label={`Copy ${activeTab} integration code for ${apiName}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: copied ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: '0.25rem 0.55rem',
            fontSize: '0.725rem',
            fontWeight: 500,
            color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>{t.codeBlock.copied}</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>{t.codeBlock.copy}</span>
            </>
          )}
        </button>
      </div>

      {/* Code Viewer */}
      <pre style={{
        margin: 0,
        padding: '1rem',
        fontSize: '0.8125rem',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.5,
        color: '#e4e4e7',
        overflowX: 'auto',
        maxHeight: '320px'
      }}>
        <code>{activeCode}</code>
      </pre>
    </div>
  );
}
