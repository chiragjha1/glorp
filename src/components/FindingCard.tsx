'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, CheckCircle2 } from 'lucide-react';
import { Finding, DeltaStatus } from '@/lib/types';
import { ImpactBadge, DeltaBadge } from './StatusBadge';
import { EvidenceBlock } from './EvidenceBlock';
import { ProposedFix } from './ProposedFix';

interface FindingCardProps {
  finding: Finding;
  deltaStatus?: DeltaStatus;
  isInitiallyExpanded?: boolean;
  onApplyFix?: (findingId: string) => void;
  isFixApplied?: boolean;
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  deltaStatus,
  isInitiallyExpanded = false,
  onApplyFix,
  isFixApplied = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const [activeTab, setActiveTab] = useState<'fix' | 'evidence'>('fix');

  return (
    <article
      className={`
        rounded-2xl liquid-glass-card
        border transition-all duration-300
        ${isFixApplied ? 'border-emerald-500/30 bg-emerald-950/10' : 'hover:border-white/30'}
      `}
      aria-labelledby={`finding-title-${finding.id}`}
    >
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ImpactBadge impact={finding.impact} />
            {deltaStatus && <DeltaBadge status={deltaStatus} />}
            <span className="text-xs font-mono text-white/40 tracking-wider">
              {finding.rule_id}
            </span>
            {isFixApplied && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Fix staged
              </span>
            )}
          </div>

          <h3
            id={`finding-title-${finding.id}`}
            className="text-base md:text-lg font-medium text-white/95 tracking-tight truncate"
          >
            {finding.description}
          </h3>

          <p className="text-xs text-white/60 line-clamp-1 font-sans">
            {finding.help}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
          {finding.wcag_tags.length > 0 && (
            <div className="hidden lg:flex items-center gap-1">
              {finding.wcag_tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[10px] font-mono text-white/50 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse finding details' : 'Expand finding details'}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Details Body */}
      {isExpanded && (
        <div className="border-t border-white/10 p-5 md:p-6 space-y-6 animate-slide-up">
          {/* Sub-navigation tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('fix')}
                className={`pb-1 uppercase tracking-wider transition-colors border-b-2 ${
                  activeTab === 'fix'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Guidance & Fix
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('evidence')}
                className={`pb-1 uppercase tracking-wider transition-colors border-b-2 ${
                  activeTab === 'evidence'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                DOM Evidence
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onApplyFix && (
                <button
                  type="button"
                  onClick={() => onApplyFix(finding.id)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border
                    ${
                      isFixApplied
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                    }
                  `}
                >
                  {isFixApplied ? '✓ Fix Staged' : 'Simulate Code Fix'}
                </button>
              )}
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'fix' ? (
            <ProposedFix finding={finding} />
          ) : (
            <EvidenceBlock
              html={finding.html}
              targets={finding.targets}
              failureSummary={finding.failure_summary}
            />
          )}

          {/* Footer Target Inspector metadata */}
          <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-white/40 gap-2 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-white/40" />
              <span>Target: {finding.targets[0] || 'document node'}</span>
            </div>
            <div>
              <span>Finding ID: {finding.id}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default FindingCard;
