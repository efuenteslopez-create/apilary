'use client';

import React from 'react';
import { ArchitectVerdict as ArchitectVerdictType } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface ArchitectVerdictProps {
  verdict: ArchitectVerdictType;
}

export default function ArchitectVerdict({ verdict }: ArchitectVerdictProps) {
  const { t } = useLanguage();

  return (
    <div style={{
      width: '100%',
      maxWidth: '1080px',
      margin: '0 auto 2.5rem auto',
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(24, 24, 27, 0.8) 100%)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-gold)',
      boxShadow: 'var(--glow-gold), 0 20px 40px rgba(0, 0, 0, 0.4)',
      padding: '1.75rem',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient gradient badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.85rem',
        borderRadius: '9999px',
        background: 'rgba(245, 158, 11, 0.15)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        color: '#fbbf24',
        fontSize: '0.8125rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        marginBottom: '1rem',
        textTransform: 'uppercase'
      }}>
        <span>⭐</span>
        <span>{t.verdict.badge}</span>
      </div>

      {/* Title */}
      <h2 style={{
        fontSize: '1.75rem',
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.02em',
        marginBottom: '0.75rem'
      }}>
        {verdict.selected_api_name}
      </h2>

      {/* Core Rationale */}
      <p style={{
        fontSize: '1.05rem',
        color: 'var(--text-primary)',
        lineHeight: 1.6,
        marginBottom: '1.5rem'
      }}>
        {verdict.core_rationale}
      </p>

      {/* Two-Column Breakdown: Key Strengths vs Primary Risks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        {/* Strengths */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem'
        }}>
          <h4 style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            color: 'var(--accent-green)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <span>✓</span> {t.verdict.keyStrengths}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {verdict.key_strengths.map((strength, idx) => (
              <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-green)', marginTop: '2px' }}>•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem'
        }}>
          <h4 style={{
            fontSize: '0.825rem',
            fontWeight: 700,
            color: '#fbbf24',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <span>⚡</span> {t.verdict.operationalRisks}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {verdict.primary_risks.map((risk, idx) => (
              <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#fbbf24', marginTop: '2px' }}>•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* When NOT to use alert */}
      {verdict.when_not_to_use && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid var(--border-red)',
          borderRadius: 'var(--radius-md)',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.1rem' }}>⛔</span>
          <div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--accent-red)',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: '0.2rem'
            }}>
              {t.verdict.whenNotToUse}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#fca5a5', lineHeight: 1.5 }}>
              {verdict.when_not_to_use}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
