'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface FeedbackWidgetProps {
  queryId: string;
}

export default function FeedbackWidget({ queryId }: FeedbackWidgetProps) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isUseful, setIsUseful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendFeedback = async (useful: boolean, optionalComment?: string) => {
    setIsSending(true);
    setIsUseful(useful);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_id: queryId,
          is_useful: useful,
          comment: optionalComment || comment
        })
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        textAlign: 'center',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        color: 'var(--accent-green)',
        fontSize: '0.875rem'
      }}>
        {t.feedback.thankYou}
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2.5rem auto',
      padding: '1.25rem 1.5rem',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem'
    }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {t.feedback.question}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          id="feedback-useful-yes"
          type="button"
          onClick={() => sendFeedback(true)}
          disabled={isSending}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <span>👍</span>
          <span>{t.feedback.yes}</span>
        </button>

        <button
          id="feedback-useful-no"
          type="button"
          onClick={() => sendFeedback(false)}
          disabled={isSending}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <span>👎</span>
          <span>{t.feedback.no}</span>
        </button>
      </div>

      {isUseful !== null && !submitted && (
        <div style={{ width: '100%', marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder={t.feedback.placeholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem'
            }}
          />
          <button
            type="button"
            onClick={() => sendFeedback(isUseful, comment)}
            style={{
              padding: '0.4rem 0.875rem',
              background: 'var(--grad-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {t.feedback.submit}
          </button>
        </div>
      )}
    </div>
  );
}
