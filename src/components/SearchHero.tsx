'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchHero({ onSearch, isLoading }: SearchHeroProps) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onSearch(query.trim());
      }
    }
  };

  const selectPreset = (presetText: string) => {
    setQuery(presetText);
    onSearch(presetText);
  };

  return (
    <section style={{
      width: '100%',
      maxWidth: '880px',
      margin: '0 auto',
      padding: '3rem 1.5rem 2rem 1.5rem',
      textAlign: 'center'
    }}>
      {/* Headline */}
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.25rem)',
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
        marginBottom: '1rem',
        background: 'linear-gradient(180deg, #FFFFFF 20%, #A1A1AA 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {t.hero.title}
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.15rem)',
        color: 'var(--text-secondary)',
        maxWidth: '640px',
        margin: '0 auto 2.25rem auto',
        lineHeight: 1.5
      }}>
        {t.hero.subtitle}
      </p>

      {/* Interactive Input Form */}
      <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', marginBottom: '1.75rem' }}>
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
          padding: '1px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), var(--glow-blue)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'calc(var(--radius-xl) - 1px)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <textarea
              id="architecture-query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.hero.placeholder}
              rows={3}
              disabled={isLoading}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '1.05rem',
                lineHeight: 1.5,
                resize: 'none'
              }}
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Press <kbd style={{ padding: '0.15rem 0.35rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Ctrl</kbd> + <kbd style={{ padding: '0.15rem 0.35rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>Enter</kbd> {t.hero.ctrlEnterTip}
              </span>

              <button
                id="analyze-architect-btn"
                type="submit"
                disabled={isLoading || !query.trim()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.35rem',
                  borderRadius: 'var(--radius-md)',
                  background: isLoading || !query.trim() ? 'rgba(255,255,255,0.1)' : 'var(--grad-primary)',
                  color: isLoading || !query.trim() ? 'var(--text-muted)' : '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isLoading || !query.trim() ? 'none' : '0 4px 20px rgba(99, 102, 241, 0.4)'
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    <span>{t.hero.analyzingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.hero.analyzeBtn}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Preset Chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>{t.hero.popularScenarios}</span>
        {t.hero.presets.map((preset, index) => (
          <button
            key={index}
            type="button"
            onClick={() => selectPreset(preset.query)}
            disabled={isLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '0.35rem 0.75rem',
              color: 'var(--text-secondary)',
              fontSize: '0.775rem',
              fontWeight: 500,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
