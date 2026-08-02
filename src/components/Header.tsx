'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <header style={{
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 9, 11, 0.8)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.875rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-blue)',
            fontWeight: 800,
            fontSize: '1rem',
            color: '#fff'
          }}>
            A
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Apilary
          </span>
        </Link>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.2rem 0.6rem',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          fontSize: '0.725rem',
          fontWeight: 600,
          color: '#818cf8',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8' }} />
          {t.header.architectBadge}
        </div>
      </div>

      {/* Right meta actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Language Switcher */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '2px',
          gap: '2px'
        }}>
          <button
            type="button"
            onClick={() => setLocale('es')}
            aria-label="Cambiar idioma a Español"
            style={{
              background: locale === 'es' ? 'var(--grad-primary)' : 'transparent',
              color: locale === 'es' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.55rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => setLocale('en')}
            aria-label="Switch language to English"
            style={{
              background: locale === 'en' ? 'var(--grad-primary)' : 'transparent',
              color: locale === 'en' ? '#ffffff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              padding: '0.25rem 0.55rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            EN
          </button>
        </div>

        <div style={{
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem'
        }} className="desktop-only-badge">
          <span style={{ color: 'var(--accent-green)' }}>●</span> {t.header.curatedApis}
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.4rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          {t.header.docsLink}
        </a>
      </div>
    </header>
  );
}
