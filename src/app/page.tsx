'use client';

import React, { useState } from 'react';
import { ShaderBackground } from '@/components/ShaderBackground';
import { GlassInput } from '@/components/GlassInput';
import { AuditResults } from '@/components/AuditResults';
import { ScanRun } from '@/lib/types';
import { auditPage } from '@/lib/api';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [targetUrl, setTargetUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState<string>('Initializing scanner...');
  const [scanResult, setScanResult] = useState<ScanRun | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [quoteStyle, setQuoteStyle] = useState<'ai_question' | 'wcag_stat'>('ai_question');

  // Trigger audit flow
  const handleStartAudit = async (url: string) => {
    setTargetUrl(url);
    setIsAuditing(true);
    setAuditError(null);

    // Progressive loading messages
    setAuditStep('Navigating to target URL...');
    const stepTimer1 = setTimeout(() => {
      setAuditStep('Evaluating DOM tree & rendered styles...');
    }, 450);

    const stepTimer2 = setTimeout(() => {
      setAuditStep('Executing Axe Core WCAG rule engine...');
    }, 950);

    const stepTimer3 = setTimeout(() => {
      setAuditStep('Compiling deterministic findings & evidence...');
    }, 1350);

    try {
      const result = await auditPage(url);
      setScanResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to execute audit.';
      setAuditError(msg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsAuditing(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setAuditError(null);
    setIsAuditing(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-[#E8FD00] selection:text-black font-sans">
      {/* 1. Skip link for screen reader and keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#E8FD00] focus:text-black focus:font-mono focus:text-xs focus:rounded focus:outline-none"
      >
        Skip to main content
      </a>

      {/* 2. WebGL Canvas Shader Background filling parent */}
      <ShaderBackground className="absolute inset-0" speed={0.9} />

      {/* 3. Main Content Layer */}
      <main id="main-content" className="relative z-10 min-h-screen flex flex-col justify-between">
        {scanResult ? (
          // Results View
          <AuditResults
            scanRun={scanResult}
            onReset={handleReset}
            onUpdateRun={(updated) => setScanResult(updated)}
          />
        ) : (
          // Landing View — Exact match to reference screenshot
          <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-24 text-center max-w-4xl mx-auto w-full">
            <div className="space-y-6 md:space-y-8 animate-fade-in w-full">
              {/* Wordmark: "Glorp" in elegant serif italic display */}
              <h1 className="font-serifDisplay italic text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-normal tracking-tight select-none drop-shadow-md">
                Glorp
              </h1>

              {/* Subtitle statement */}
              <div className="max-w-xl mx-auto text-center px-2">
                {quoteStyle === 'ai_question' ? (
                  <p className="text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed tracking-normal">
                    AI can build a website in seconds.
                    <br />
                    <span className="text-white/70">
                      But can it tell you if everyone can use it?
                    </span>
                  </p>
                ) : (
                  <p className="text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed tracking-normal">
                    95% websites all over the world fail to meet basic{' '}
                    <strong className="font-semibold text-white">
                      Web Content Accessibility Guidelines (WCAG)
                    </strong>{' '}
                    and automated accessibility standards like axe
                  </p>
                )}

                {/* Subtitle switch pill */}
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setQuoteStyle(quoteStyle === 'ai_question' ? 'wcag_stat' : 'ai_question')
                    }
                    className="text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors uppercase tracking-wider underline decoration-white/20 underline-offset-4"
                  >
                    {quoteStyle === 'ai_question'
                      ? 'Show 95% WCAG study quote'
                      : 'Show AI product prompt'}
                  </button>
                </div>
              </div>

              {/* Rectangular bright yellow highlight box: IS YOUR WEBSITE ACCESSIBLE? */}
              <div className="pt-2 pb-2">
                <div className="inline-block bg-[#E8FD00] text-black px-4 sm:px-6 py-1.5 sm:py-2 shadow-yellow-glow">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wider uppercase font-serifDisplay select-none">
                    {quoteStyle === 'ai_question'
                      ? 'IS YOUR WEBSITE ACCESSIBLE?'
                      : 'IS YOUR WEBSITE ONE OF THEM?'}
                  </span>
                </div>
              </div>

              {/* Liquid Glass URL Input */}
              <div className="pt-2 w-full max-w-2xl mx-auto">
                <GlassInput
                  onSubmit={handleStartAudit}
                  isLoading={isAuditing}
                  placeholder="Enter or paste a URL..."
                />
              </div>

              {/* Subtle Loading status indicator */}
              {isAuditing && (
                <div
                  role="status"
                  aria-live="polite"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs font-mono text-purple-200 animate-pulse-subtle"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>{auditStep}</span>
                </div>
              )}

              {/* Audit Error Alert */}
              {auditError && (
                <div
                  role="alert"
                  className="max-w-md mx-auto p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 font-mono text-center"
                >
                  <span>{auditError}</span>
                </div>
              )}

              {/* Quick sample URLs to try */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-white/40">
                <span className="uppercase text-[11px] tracking-wider text-white/30 mr-1">
                  Or test with:
                </span>
                {[
                  { label: 'berkshirehathaway.com', url: 'https://www.berkshirehathaway.com/' },
                  { label: 'localhost:3000', url: 'http://localhost:3000' },
                  { label: 'acme-studio.dev', url: 'https://acme-studio.dev' },
                ].map((sample) => (
                  <button
                    key={sample.url}
                    type="button"
                    onClick={() => handleStartAudit(sample.url)}
                    disabled={isAuditing}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 hover:border-white/25 hover:text-white transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Minimal Footer */}
        <footer className="w-full py-6 px-6 text-center text-xs font-mono text-white/30 select-none">
          <span>Glorp • Deterministic Accessibility Audit & Verification Companion</span>
        </footer>
      </main>
    </div>
  );
}
