'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchHero from '@/components/SearchHero';
import ArchitectureBrief from '@/components/ArchitectureBrief';
import ArchitectVerdict from '@/components/ArchitectVerdict';
import ComparisonMatrix from '@/components/ComparisonMatrix';
import ResultCard from '@/components/ResultCard';
import FeedbackWidget from '@/components/FeedbackWidget';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { RecommendationResponse } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { locale, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecommendationResponse | null>(null);

  const handleSearch = async (userQuery: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery, locale })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || (locale === 'es' ? `Error en la solicitud: estado ${response.status}` : `Request failed with status ${response.status}`));
      }

      const data: RecommendationResponse = await response.json();
      setResults(data);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('architect-results-container');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: unknown) {
      console.error('Search failed:', err);
      setError(err instanceof Error ? err.message : t.errors.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), rgba(9, 9, 11, 0))'
    }}>
      {/* Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        {/* Search Hero Section */}
        <SearchHero onSearch={handleSearch} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <div style={{
            maxWidth: '680px',
            margin: '1.5rem auto',
            padding: '1rem 1.25rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--border-red)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            color: '#fca5a5',
            fontSize: '0.9rem'
          }}>
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.2rem'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Results Container */}
        {results && !isLoading && (
          <section
            id="architect-results-container"
            style={{
              width: '100%',
              maxWidth: '1080px',
              margin: '2rem auto 0 auto',
              padding: '0 1.5rem',
              animation: 'fadeIn 0.4s ease-out'
            }}
          >
            {/* 1. Architecture Understanding & Response Time */}
            <ArchitectureBrief
              understanding={results.understanding}
              responseTimeMs={results.response_time_ms}
            />

            {/* 2. Definitive Architect Verdict (⭐ Recommendation) */}
            <ArchitectVerdict verdict={results.architect_verdict} />

            {/* 3. 5-Dimension Comparison Matrix */}
            <ComparisonMatrix matrix={results.comparison_matrix} />

            {/* 4. Top 3 Candidate Cards with Tabbed Code Snippets */}
            <div style={{
              marginTop: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.25rem' }}>📦</span>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                    {t.results.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {t.results.subtitle}
                  </p>
                </div>
              </div>

              {results.recommendations.map((api, idx) => (
                <ResultCard key={api.api_id || idx} api={api} index={idx} />
              ))}
            </div>

            {/* 5. User Feedback Rating Widget */}
            <FeedbackWidget queryId={results.query_id} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        width: '100%',
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8125rem',
        background: 'rgba(9, 9, 11, 0.8)'
      }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Apilary</strong> — {t.footer.tagline}
          </div>
          <div>
            {t.footer.techStack}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} Apilary. {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
