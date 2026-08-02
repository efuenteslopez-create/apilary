'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ArchitectureBriefProps {
  understanding: string;
  responseTimeMs?: number;
  candidateCount?: number;
}

export default function ArchitectureBrief({
  understanding,
  responseTimeMs,
  candidateCount = 20
}: ArchitectureBriefProps) {
  const { t } = useLanguage();

  return (
    <div style={{
      width: '100%',
      maxWidth: '1080px',
      margin: '0 auto 1.5rem auto',
      background: 'rgba(18, 18, 21, 0.6)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>🧠</span>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--text-secondary)'
          }}>
            {t.brief.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {responseTimeMs && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--accent-green)',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              ⚡ {responseTimeMs}ms
            </span>
          )}
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)'
          }}>
            {t.brief.evaluatedCount(candidateCount)}
          </span>
        </div>
      </div>

      <p style={{
        fontSize: '0.975rem',
        color: 'var(--text-primary)',
        lineHeight: 1.6
      }}>
        {understanding}
      </p>
    </div>
  );
}
