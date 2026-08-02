'use client';

import React from 'react';
import { RecommendedApi } from '@/lib/types';
import CodeBlock from './CodeBlock';
import { useLanguage } from '@/context/LanguageContext';

interface ResultCardProps {
  api: RecommendedApi;
  index: number;
}

export default function ResultCard({ api, index }: ResultCardProps) {
  const { t } = useLanguage();

  const getRiskBadge = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return {
          label: t.results.risks.low,
          color: 'var(--accent-green)',
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.25)'
        };
      case 'medium':
        return {
          label: t.results.risks.medium,
          color: '#fbbf24',
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'rgba(245, 158, 11, 0.25)'
        };
      case 'high':
        return {
          label: t.results.risks.high,
          color: 'var(--accent-red)',
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.25)'
        };
    }
  };

  const riskBadge = getRiskBadge(api.risk_level);

  return (
    <div style={{
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-subtle)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
      transition: 'border-color 0.2s ease'
    }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              #{index + 1}
            </span>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.01em'
            }}>
              {api.api_name}
            </h3>
          </div>

          {api.tagline && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {api.tagline}
            </p>
          )}
        </div>

        {/* Badges & Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.725rem',
            fontWeight: 600,
            color: riskBadge.color,
            background: riskBadge.bg,
            border: `1px solid ${riskBadge.border}`,
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            textTransform: 'uppercase'
          }}>
            {riskBadge.label}
          </span>

          {api.website_url && (
            <a
              href={api.website_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent-blue)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <span>{t.results.siteBtn}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}

          {api.docs_url && (
            <a
              href={api.docs_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent-purple)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}
            >
              <span>{t.results.docsBtn}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Why Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          {t.results.architecturalFit}
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {api.why}
        </p>
      </div>

      {/* Pros & Cons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.875rem' }}>
        {/* Pros */}
        <div style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            {t.results.pros}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {api.pros.map((pro, i) => (
              <li key={i} style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ color: 'var(--accent-green)', marginTop: '1px' }}>+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            {t.results.cons}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {api.cons.map((con, i) => (
              <li key={i} style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ color: 'var(--accent-red)', marginTop: '1px' }}>−</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing & Risk notes */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        paddingTop: '0.25rem'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>{t.results.pricing} </span>
          <span style={{ color: '#e4e4e7', fontWeight: 500 }}>{api.pricing_evaluation}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>{t.results.riskNote} </span>
          <span style={{ color: 'var(--text-secondary)' }}>{api.risk_note}</span>
        </div>
      </div>

      {/* Tabbed Code Snippet */}
      <CodeBlock snippets={api.code_snippets} apiName={api.api_name} />
    </div>
  );
}
