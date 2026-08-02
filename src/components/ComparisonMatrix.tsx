'use client';

import React from 'react';
import { ComparisonMatrix as ComparisonMatrixType } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface ComparisonMatrixProps {
  matrix: ComparisonMatrixType;
}

export default function ComparisonMatrix({ matrix }: ComparisonMatrixProps) {
  const { t } = useLanguage();

  if (!matrix || !matrix.api_evaluations || matrix.api_evaluations.length === 0) {
    return null;
  }

  const dimensions = matrix.dimensions && matrix.dimensions.length === 5
    ? matrix.dimensions
    : t.matrix.dimensions;

  return (
    <div style={{
      width: '100%',
      maxWidth: '1080px',
      margin: '2.5rem auto',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Title */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem' }}>📊</span>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            {t.matrix.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t.matrix.subtitle}
          </p>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.85rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{
                padding: '0.75rem 1rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                width: '25%'
              }}>
                {t.matrix.dimension}
              </th>
              {matrix.api_evaluations.map((evalItem, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '0.75rem 1rem',
                    color: idx === 0 ? '#fbbf24' : '#fff',
                    fontWeight: 700,
                    width: `${75 / matrix.api_evaluations.length}%`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {idx === 0 && <span style={{ fontSize: '0.85rem' }}>⭐</span>}
                    <span>{evalItem.api_name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim, dimIdx) => (
              <tr
                key={dimIdx}
                style={{
                  borderBottom: dimIdx === dimensions.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                  background: dimIdx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                }}
              >
                <td style={{
                  padding: '0.875rem 1rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)'
                }}>
                  {dim}
                </td>

                {matrix.api_evaluations.map((evalItem, apiIdx) => {
                  const score = evalItem.scores[dimIdx] || 'Standard';
                  return (
                    <td
                      key={apiIdx}
                      style={{
                        padding: '0.875rem 1rem',
                        color: apiIdx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                        lineHeight: 1.4
                      }}
                    >
                      <span style={{
                        display: 'inline-block',
                        background: apiIdx === 0 ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: apiIdx === 0 ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.8125rem'
                      }}>
                        {score}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
