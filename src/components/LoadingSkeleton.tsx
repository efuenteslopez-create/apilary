'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoadingSkeleton() {
  const { t } = useLanguage();

  return (
    <div style={{
      width: '100%',
      maxWidth: '1080px',
      margin: '2rem auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Top message */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        fontWeight: 500,
        marginBottom: '0.5rem'
      }}>
        <div style={{
          width: '18px',
          height: '18px',
          border: '2px solid rgba(99, 102, 241, 0.3)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>{t.skeleton.evaluating}</span>
      </div>

      {/* Skeleton Architect Verdict */}
      <div style={{
        height: '240px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        border: '1px solid var(--border-gold)'
      }} />

      {/* Skeleton Result Cards */}
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          style={{
            height: '200px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            border: '1px solid var(--border-subtle)'
          }}
        />
      ))}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
