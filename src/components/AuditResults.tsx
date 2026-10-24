'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  SlidersHorizontal,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  GitCompare,
} from 'lucide-react';
import { ScanRun, VerificationResult, Impact } from '@/lib/types';
import { countImpacts, verifyFixes } from '@/lib/api';
import { GateBadge } from './StatusBadge';
import { FindingCard } from './FindingCard';
import { VerificationPanel } from './VerificationPanel';

interface AuditResultsProps {
  scanRun: ScanRun;
  onReset: () => void;
  onUpdateRun?: (updatedRun: ScanRun) => void;
}

export const AuditResults: React.FC<AuditResultsProps> = ({
  scanRun,
  onReset,
  onUpdateRun,
}) => {
  const [selectedImpact, setSelectedImpact] = useState<Impact | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [stagedFixes, setStagedFixes] = useState<Set<string>>(new Set());

  const impacts = countImpacts(scanRun.findings);
  const totalIssues = scanRun.counts.violation_node_count;

  // Filter findings based on user selection
  const filteredFindings = scanRun.findings.filter((f) => {
    if (selectedImpact !== 'all' && f.impact !== selectedImpact) return false;
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'contrast' && f.rule_id !== 'color-contrast') return false;
      if (selectedCategory === 'images' && f.rule_id !== 'image-alt') return false;
      if (selectedCategory === 'forms' && !['label', 'select-name'].includes(f.rule_id)) return false;
      if (selectedCategory === 'links' && f.rule_id !== 'link-name') return false;
      if (selectedCategory === 'buttons' && f.rule_id !== 'button-name') return false;
      if (selectedCategory === 'lang' && !['html-has-lang', 'html-lang-valid'].includes(f.rule_id))
        return false;
    }
    return true;
  });

  // Handle stage/simulate fix on a finding
  const handleToggleFix = (findingId: string) => {
    setStagedFixes((prev) => {
      const next = new Set(prev);
      if (next.has(findingId)) {
        next.delete(findingId);
      } else {
        next.add(findingId);
      }
      return next;
    });
  };

  // Run verification rescan
  const handleRunVerification = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyFixes(scanRun.requested_url, scanRun.run_id);
      setVerificationData(result);
      setShowVerification(true);
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-16 space-y-10 animate-fade-in">
      {/* Top Navigation & Minimal Brand Accent */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <button
          onClick={onReset}
          className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>New Audit</span>
        </button>

        <div className="text-center">
          <span className="font-serifDisplay italic text-2xl text-white tracking-wide">
            Glorp
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!verificationData) {
                handleRunVerification();
              } else {
                setShowVerification(!showVerification);
              }
            }}
            disabled={isVerifying}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 border
              ${
                showVerification
                  ? 'bg-purple-600/30 border-purple-400/50 text-purple-200'
                  : 'bg-white/5 border-white/15 text-white/70 hover:text-white hover:border-white/30'
              }
            `}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{showVerification ? 'Hide Verification' : 'Verification Mode'}</span>
          </button>
        </div>
      </div>

      {/* Editorial Results Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-300 font-semibold">
                Accessibility Audit
              </span>
              <GateBadge gate={scanRun.gate} />
            </div>
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight break-all font-mono">
              {new URL(scanRun.requested_url).hostname}
            </h1>
            {scanRun.page_title && (
              <p className="text-sm font-medium text-white/80 font-sans tracking-wide">
                {scanRun.page_title}
              </p>
            )}
            <p className="text-xs text-white/50 font-mono">
              Tested at {new Date(scanRun.completed_at).toLocaleTimeString()} ({scanRun.duration_ms}ms) • Axe Core {scanRun.engine.axe_version}
            </p>
          </div>

          {/* Metric Cards: Score + Issues Detected */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Accessibility Conformance Score */}
            <div className="liquid-glass-card rounded-2xl p-4 md:p-5 text-center min-w-[130px] md:min-w-[150px] border border-white/15">
              <div className="flex items-baseline justify-center gap-1">
                <span
                  className={`text-3xl md:text-5xl font-extralight font-mono tracking-tighter ${
                    (scanRun.score ?? 50) < 60
                      ? 'text-red-400'
                      : (scanRun.score ?? 50) < 80
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {scanRun.score ?? 50}
                </span>
                <span className="text-xs font-mono text-white/40">/100</span>
              </div>
              <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-white/50 mt-1">
                Accessibility Score
              </div>
              {scanRun.score_grade && (
                <span className="inline-block mt-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                  {scanRun.score_grade}
                </span>
              )}
            </div>

            {/* Total Issues Highlight */}
            <div className="liquid-glass-card rounded-2xl p-4 md:p-5 text-center min-w-[130px] md:min-w-[150px] border border-white/15">
              <div className="text-3xl md:text-5xl font-extralight text-white font-mono tracking-tighter">
                {totalIssues}
              </div>
              <div className="text-[10px] md:text-[11px] font-mono uppercase tracking-wider text-white/50 mt-1">
                Issues Detected
              </div>
              <span className="inline-block mt-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                WCAG AA FAILED
              </span>
            </div>
          </div>
        </div>

        {/* Severity Metrics Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {/* Critical */}
          <button
            type="button"
            onClick={() => setSelectedImpact(selectedImpact === 'critical' ? 'all' : 'critical')}
            className={`
              p-3.5 rounded-xl border text-left transition-all duration-200 select-none
              ${
                selectedImpact === 'critical'
                  ? 'bg-red-950/40 border-red-500/60 ring-1 ring-red-400/40'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }
            `}
          >
            <div className="text-2xl font-light text-red-300 font-mono">{impacts.critical}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mt-1">
              Critical
            </div>
          </button>

          {/* Serious */}
          <button
            type="button"
            onClick={() => setSelectedImpact(selectedImpact === 'serious' ? 'all' : 'serious')}
            className={`
              p-3.5 rounded-xl border text-left transition-all duration-200 select-none
              ${
                selectedImpact === 'serious'
                  ? 'bg-orange-950/40 border-orange-500/60 ring-1 ring-orange-400/40'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }
            `}
          >
            <div className="text-2xl font-light text-orange-300 font-mono">{impacts.serious}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mt-1">
              Serious
            </div>
          </button>

          {/* Moderate */}
          <button
            type="button"
            onClick={() => setSelectedImpact(selectedImpact === 'moderate' ? 'all' : 'moderate')}
            className={`
              p-3.5 rounded-xl border text-left transition-all duration-200 select-none
              ${
                selectedImpact === 'moderate'
                  ? 'bg-yellow-950/40 border-yellow-500/60 ring-1 ring-yellow-400/40'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }
            `}
          >
            <div className="text-2xl font-light text-yellow-300 font-mono">{impacts.moderate}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mt-1">
              Moderate
            </div>
          </button>

          {/* Minor */}
          <button
            type="button"
            onClick={() => setSelectedImpact(selectedImpact === 'minor' ? 'all' : 'minor')}
            className={`
              p-3.5 rounded-xl border text-left transition-all duration-200 select-none
              ${
                selectedImpact === 'minor'
                  ? 'bg-blue-950/40 border-blue-500/60 ring-1 ring-blue-400/40'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }
            `}
          >
            <div className="text-2xl font-light text-blue-300 font-mono">{impacts.minor}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mt-1">
              Minor
            </div>
          </button>
        </div>
      </header>

      {/* Core Philosophy Banner */}
      <aside
        aria-label="Glorp Engine Philosophy"
        className="liquid-glass-card rounded-2xl p-4 md:p-5 border border-purple-500/20 bg-purple-950/15"
      >
        <div className="flex items-start gap-3.5">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white/90 uppercase tracking-wider font-mono">
              Deterministic Verification Architecture
            </p>
            <p className="text-white/70 leading-relaxed font-sans">
              Glorp never presents AI reasoning as authoritative evidence. The automated accessibility engine determines violation existence and evidence; AI explains the barrier and proposes context-aware source code repairs.
            </p>
          </div>
        </div>
      </aside>

      {/* Verification Panel (Toggleable) */}
      {showVerification && verificationData && (
        <section aria-label="Verification Rescan Section" className="animate-slide-up">
          <VerificationPanel
            verificationResult={verificationData}
            baselineRun={scanRun}
            onRescan={handleRunVerification}
            isRescanning={isVerifying}
          />
        </section>
      )}

      {/* Filter Category Tabs & Staged Count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full text-xs font-mono">
          <span className="text-white/40 flex items-center gap-1 uppercase mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter:
          </span>
          {[
            { id: 'all', label: 'All Findings' },
            { id: 'contrast', label: 'Contrast' },
            { id: 'images', label: 'Images' },
            { id: 'forms', label: 'Forms' },
            { id: 'links', label: 'Links' },
            { id: 'buttons', label: 'Buttons' },
            { id: 'lang', label: 'Language' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-3 py-1 rounded-full whitespace-nowrap transition-colors border
                ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black border-white font-medium'
                    : 'bg-white/[0.04] text-white/60 border-white/10 hover:text-white hover:border-white/25'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {stagedFixes.size > 0 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-mono text-emerald-400">
              {stagedFixes.size} fix{stagedFixes.size > 1 ? 'es' : ''} staged
            </span>
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 text-xs font-mono uppercase tracking-wider hover:bg-emerald-500/30 transition-colors"
            >
              Verify Fixes Now →
            </button>
          </div>
        )}
      </div>

      {/* Findings List */}
      <section aria-label="Detected Violations" className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="liquid-glass-card rounded-2xl p-10 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-medium text-white/90">No violations match filter</h3>
            <p className="text-xs text-white/50 font-mono">
              Adjust your filters or reset to view all detected items.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding, idx) => {
            // Determine delta status if verification is active
            let deltaStatus = undefined;
            if (verificationData) {
              const comp = verificationData.comparison;
              if (comp.remaining_ids.includes(finding.id)) deltaStatus = 'remaining' as const;
              else if (comp.no_longer_detected_ids.includes(finding.id))
                deltaStatus = 'no_longer_detected' as const;
              else if (comp.uncertain_baseline_ids.includes(finding.id))
                deltaStatus = 'uncertain' as const;
            }

            return (
              <FindingCard
                key={finding.id}
                finding={finding}
                deltaStatus={deltaStatus}
                isInitiallyExpanded={idx === 0}
                onApplyFix={handleToggleFix}
                isFixApplied={stagedFixes.has(finding.id)}
              />
            );
          })
        )}
      </section>

      {/* Review Required Section (Human/Ambiguous Items) */}
      {scanRun.review_items.length > 0 && (
        <section aria-label="Human Review Items" className="space-y-3 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono uppercase tracking-wider text-amber-300 font-semibold">
              Incomplete Checks Requiring Manual Review ({scanRun.review_items.length})
            </h2>
          </div>
          <p className="text-xs text-white/60 font-sans">
            Automated tools cannot evaluate ambiguous foregrounds, canvas backgrounds, or context-dependent semantics.
          </p>

          <div className="space-y-2.5">
            {scanRun.review_items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl liquid-glass-card border border-amber-500/20 text-xs font-mono space-y-2"
              >
                <div className="flex items-center justify-between text-amber-200">
                  <span className="font-semibold">{item.rule_id}</span>
                  <span className="text-[10px] text-white/40 uppercase">Manual Inspection</span>
                </div>
                <p className="text-white/70 font-sans">{item.reason}</p>
                {item.targets.length > 0 && (
                  <div className="text-[11px] text-white/50 bg-black/40 rounded px-2.5 py-1">
                    target: {item.targets.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Engine & Scope Limitations Footer */}
      <footer className="pt-6 border-t border-white/10 text-xs font-mono text-white/40 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>Engine: Axe Core {scanRun.engine.axe_version} • Scope: Full Page</span>
          <span>Run ID: {scanRun.run_id}</span>
        </div>
        <p className="text-[11px] text-white/30 leading-relaxed font-sans">
          Automated tests check detectable rule violations on the rendered page state. Keyboard accessibility, screen-reader user journeys, and logical reading order still require human verification.
        </p>
      </footer>
    </div>
  );
};

export default AuditResults;
