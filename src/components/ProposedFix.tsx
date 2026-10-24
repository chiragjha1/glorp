'use client';

import React, { useState } from 'react';
import { Sparkles, Wrench, ExternalLink, Check, Copy, AlertTriangle } from 'lucide-react';
import { Finding } from '@/lib/types';

interface ProposedFixProps {
  finding: Finding;
  className?: string;
}

export const ProposedFix: React.FC<ProposedFixProps> = ({ finding, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyDiff = () => {
    if (finding.suggested_code_diff?.after) {
      navigator.clipboard.writeText(finding.suggested_code_diff.after);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Deterministic Rule Registry Guidance */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-mono text-white/50 uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5 text-white/50" />
          <span>Rule Guidance ({finding.guidance_source})</span>
        </div>
        <p className="text-sm text-white/80 font-normal leading-relaxed pl-1">
          {finding.guidance}
        </p>
      </div>

      {/* 2. Before / After Diff if present */}
      {finding.suggested_code_diff && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-white/50">
            <span className="uppercase tracking-wider">Targeted Source Remediation</span>
            <button
              onClick={handleCopyDiff}
              className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white transition-colors px-2 py-0.5 rounded border border-white/10 hover:border-white/20 bg-white/5"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied fix</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy suggested fix</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
            {/* Before */}
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-red-200/90 overflow-x-auto">
              <span className="text-[10px] text-red-400/70 font-semibold block uppercase mb-1">
                − Current Non-Compliant
              </span>
              <pre className="whitespace-pre-wrap">{finding.suggested_code_diff.before}</pre>
            </div>

            {/* After */}
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200/90 overflow-x-auto">
              <span className="text-[10px] text-emerald-400/70 font-semibold block uppercase mb-1">
                + Accessible Replacement
              </span>
              <pre className="whitespace-pre-wrap">{finding.suggested_code_diff.after}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI Insight Section (Strictly segregated from scanner evidence) */}
      {finding.ai_insight && (
        <div className="p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/25 space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider font-semibold text-purple-300 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              AI Insight & Repair Context
            </span>
            <span className="text-[10px] font-mono text-purple-300/60 uppercase">
              Reasoning Layer
            </span>
          </div>

          <p className="text-xs text-purple-100/80 leading-relaxed font-sans">
            {finding.ai_insight}
          </p>

          <div className="pt-1 flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
            <AlertTriangle className="w-3 h-3 text-amber-400/70" />
            <span>
              The scanner determines violation existence. AI suggests context-aware repair. Rescan required to verify.
            </span>
          </div>
        </div>
      )}

      {/* WCAG Reference Link */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={finding.help_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors underline-offset-4 hover:underline"
        >
          <span>View rule documentation ({finding.rule_id})</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default ProposedFix;
