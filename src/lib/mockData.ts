import { ScanRun, VerificationResult } from './types';

export const mockSampleScanRun: ScanRun = {
  schema_version: '1.0',
  run_id: 'run_9f4b12a0e28c',
  execution: 'completed',
  started_at: '2026-10-24T07:42:10.120Z',
  completed_at: '2026-10-24T07:42:12.450Z',
  duration_ms: 2330,
  requested_url: 'https://acme-studio.internal:3000',
  final_url: 'https://acme-studio.internal:3000/',
  page_title: 'Acme Studio — Next Gen Creative AI Tools',
  conditions: {
    viewport: { width: 1280, height: 800 },
    color_scheme: 'light',
    browser_locale: 'en-US',
    readiness_selector: null,
    scope: 'full_page',
  },
  engine: {
    axe_version: '4.10.2',
    playwright_version: '1.49.0',
    rule_ids: [
      'color-contrast',
      'image-alt',
      'label',
      'select-name',
      'link-name',
      'button-name',
      'html-has-lang',
      'html-lang-valid',
    ],
    ruleset_fingerprint: 'sha256-d7a8e930f14c2b9a',
  },
  coverage: {
    categories: [
      'Text contrast',
      'Image alternatives',
      'Form labels',
      'Link names',
      'Button names',
      'Document language',
    ],
    evaluated_rule_ids: [
      'color-contrast',
      'image-alt',
      'label',
      'link-name',
      'button-name',
      'html-has-lang',
    ],
    inapplicable_rule_ids: ['select-name', 'html-lang-valid'],
    incomplete_rule_ids: ['color-contrast'],
    current_rendered_state_only: true,
    frame_coverage: 'main_document_only',
  },
  counts: {
    violation_rule_count: 5,
    violation_node_count: 7,
    incomplete_node_count: 1,
    returned_finding_count: 7,
    omitted_finding_count: 0,
  },
  findings: [
    {
      id: 'fnd_001_img_hero',
      rule_id: 'image-alt',
      impact: 'serious',
      description: 'Images must have alternate text',
      help: 'Elements must have an alt attribute or role="none" / role="presentation"',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/image-alt',
      wcag_tags: ['wcag2a', 'wcag111', 'section508'],
      targets: ['header.hero-banner > div.media-wrap > img.hero-graphic'],
      html: '<img src="/assets/hero-visual-3d.webp" class="hero-graphic w-full" />',
      failure_summary:
        'Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist or points to elements that do not exist',
      guidance:
        'Determine whether the image conveys information, performs an action or is decorative. Use meaningful context-dependent alternatives; an empty alt="" is appropriate only for confirmed decorative images. Never replace missing alternatives with a generic filename.',
      guidance_source: 'rule_registry',
      requires_context: true,
      ai_insight:
        'The image is prominently placed in the landing hero section depicting dynamic 3D generative computation. It appears to serve an illustrative branding role. If informative, recommend alt="Glorp 3D neural computation lattice visualizing web accessibility structures". If purely cosmetic, provide alt="" and aria-hidden="true".',
      suggested_code_diff: {
        before: '<img src="/assets/hero-visual-3d.webp" class="hero-graphic w-full" />',
        after: '<img src="/assets/hero-visual-3d.webp" alt="Glorp neural computation lattice" class="hero-graphic w-full" />',
      },
    },
    {
      id: 'fnd_002_btn_icon',
      rule_id: 'button-name',
      impact: 'critical',
      description: 'Buttons must have discernible text',
      help: 'Ensure buttons have discernible text or accessible names',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/button-name',
      wcag_tags: ['wcag2a', 'wcag412'],
      targets: ['nav.top-bar > div.actions > button.search-toggle-btn'],
      html: '<button class="p-2 rounded-full hover:bg-white/10"><svg class="lucide lucide-search" ...></svg></button>',
      failure_summary:
        'Fix any of the following:\n  Element does not have inner text that is visible to screen readers\n  aria-label attribute does not exist or is empty',
      guidance:
        'Provide a meaningful name describing the action. Prefer visible text; icon-only controls must have an appropriate aria-label or visually-hidden screen reader span (sr-only). Preserve action and form behavior.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'This button only renders an SVG magnifier icon without an accessible label. Assistive screen reader technologies announce this element simply as "button", leaving users uninformed of its purpose.',
      suggested_code_diff: {
        before: '<button class="p-2 rounded-full hover:bg-white/10">',
        after: '<button aria-label="Open search dialog" class="p-2 rounded-full hover:bg-white/10">',
      },
    },
    {
      id: 'fnd_003_contrast_subtext',
      rule_id: 'color-contrast',
      impact: 'serious',
      description: 'Elements must meet minimum color contrast ratio thresholds',
      help: 'Ensure the contrast between foreground text and background meets WCAG 2 AA requirements (4.5:1 for regular text)',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/color-contrast',
      wcag_tags: ['wcag2aa', 'wcag143'],
      targets: ['section.pricing > div.tier-card > p.tier-disclaimer'],
      html: '<p class="text-xs text-zinc-500">Billed annually. Cancel anytime with zero fees.</p>',
      failure_summary:
        'Element has insufficient color contrast of 2.82:1 (foreground color: #71717a, background color: #0b0713, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1',
      guidance:
        'Use rendered foreground/background evidence and engine threshold information. Adjust foreground color token to at least #a1a1aa or lighter to satisfy the 4.5:1 requirement while maintaining hierarchy.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'The #71717a grey text on the dark #0b0713 background results in a 2.82:1 ratio, which is difficult for users with low vision or high ambient glare. Bumping the text tone to text-zinc-400 (#a1a1aa) yields a safe 5.1:1 ratio.',
      suggested_code_diff: {
        before: '<p class="text-xs text-zinc-500">Billed annually...</p>',
        after: '<p class="text-xs text-zinc-400">Billed annually...</p>',
      },
    },
    {
      id: 'fnd_004_input_label',
      rule_id: 'label',
      impact: 'critical',
      description: 'Form elements must have associated labels',
      help: 'Ensure every form element has a programmatic label',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/label',
      wcag_tags: ['wcag2a', 'wcag412', 'wcag131'],
      targets: ['form#newsletter > input[type="email"]'],
      html: '<input type="email" placeholder="Enter your work email address" class="email-input" />',
      failure_summary:
        'Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist\n  <label> wrapper does not exist\n  id and for attributes do not match',
      guidance:
        'Prefer a visible label correctly associated with the control using <label for="...">; use an aria-label attribute when design constraints require an icon-only or standalone control. Placeholders alone are insufficient for accessibility.',
      guidance_source: 'rule_registry',
      requires_context: true,
      ai_insight:
        'Placeholders disappear when typing and are not reliably conveyed by all screen readers. Add a visually-hidden label or an explicit aria-label="Work email address".',
      suggested_code_diff: {
        before: '<input type="email" placeholder="Enter your work email address" class="email-input" />',
        after: '<input type="email" aria-label="Work email address" placeholder="Enter your work email address" class="email-input" />',
      },
    },
    {
      id: 'fnd_005_empty_link',
      rule_id: 'link-name',
      impact: 'serious',
      description: 'Links must have discernible text',
      help: 'Ensure links have discernible text or accessible names',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/link-name',
      wcag_tags: ['wcag2a', 'wcag412', 'wcag244'],
      targets: ['footer.site-footer > div.social-links > a.social-twitter'],
      html: '<a href="https://x.com/glorp_a11y" target="_blank" class="social-icon"><svg>...</svg></a>',
      failure_summary:
        'Fix any of the following:\n  Element is in tab order and does not have accessible text',
      guidance:
        'Provide an accessible name describing the destination or purpose using available context. Preserve the destination URL. Do not hide necessary interactive content.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'An empty anchor tag wrapping an SVG cannot be announced with its destination by screen reader tools. Add aria-label="Follow Glorp on X (opens in a new tab)" and rel="noopener noreferrer".',
      suggested_code_diff: {
        before: '<a href="https://x.com/glorp_a11y" target="_blank" class="social-icon">',
        after: '<a href="https://x.com/glorp_a11y" target="_blank" rel="noopener noreferrer" aria-label="Follow Glorp on X (opens in new tab)" class="social-icon">',
      },
    },
    {
      id: 'fnd_006_html_lang',
      rule_id: 'html-has-lang',
      impact: 'serious',
      description: '<html> element must have a lang attribute',
      help: 'Ensure every HTML document specifies a valid lang attribute',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/html-has-lang',
      wcag_tags: ['wcag2a', 'wcag311'],
      targets: ['html'],
      html: '<html class="dark">',
      failure_summary: 'The <html> element does not have a lang attribute',
      guidance:
        'Declare a valid primary language based on actual page content and project locale (e.g. lang="en"). Do not leave the root tag unassigned.',
      guidance_source: 'rule_registry',
      requires_context: true,
      ai_insight:
        'Screen readers use the html lang attribute to load the correct pronunciation dictionaries and vocal synthesis models. Missing lang can result in synthesized speech reading content with erroneous foreign phonetics.',
      suggested_code_diff: {
        before: '<html class="dark">',
        after: '<html lang="en" class="dark">',
      },
    },
    {
      id: 'fnd_007_contrast_footer',
      rule_id: 'color-contrast',
      impact: 'moderate',
      description: 'Elements must meet minimum color contrast ratio thresholds',
      help: 'Ensure contrast between copyright caption and dark footer background meets WCAG AA',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/color-contrast',
      wcag_tags: ['wcag2aa', 'wcag143'],
      targets: ['footer.site-footer > p.copyright'],
      html: '<p class="copyright text-neutral-600 text-[11px]">© 2026 Acme Corp. All rights reserved.</p>',
      failure_summary:
        'Element has insufficient color contrast of 3.1:1 (foreground: #525252, background: #08050e). Expected at least 4.5:1.',
      guidance:
        'Adjust footer metadata color token to at least #8e8e93 for adequate visual clarity.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'Subtle footer metadata often gets set too dark in dark-mode themes. Raising foreground brightness slightly ensures readability without breaking secondary visual hierarchy.',
      suggested_code_diff: {
        before: '<p class="copyright text-neutral-600 text-[11px]">',
        after: '<p class="copyright text-neutral-400 text-[11px]">',
      },
    },
  ],
  review_items: [
    {
      rule_id: 'color-contrast',
      targets: ['div.hero-gradient-overlay > span.headline-accent'],
      reason:
        'Element is layered over a dynamic multi-stop gradient or transparent canvas background; automated contrast calculation is inconclusive and requires human visual review.',
      html: '<span class="headline-accent bg-clip-text text-transparent bg-gradient-to-r ...">Accessible Intelligence</span>',
    },
  ],
  gate: 'fail',
  details_truncated: false,
  report_path: '/tmp/glorp_runs/run_9f4b12a0e28c.json',
  warnings: [],
  limitations: [
    'Main document only; cross-origin frames not traversed in P0',
    'Current rendered DOM state at scan timestamp only; does not guarantee dynamic dialog or dropdown states',
  ],
};

export const mockSampleVerificationResult: VerificationResult = {
  schema_version: '1.0',
  baseline_id: 'run_9f4b12a0e28c',
  current_run: {
    ...mockSampleScanRun,
    run_id: 'run_c317ab982e01',
    started_at: '2026-10-24T07:44:18.010Z',
    completed_at: '2026-10-24T07:44:19.890Z',
    duration_ms: 1880,
    counts: {
      violation_rule_count: 1,
      violation_node_count: 1,
      incomplete_node_count: 1,
      returned_finding_count: 1,
      omitted_finding_count: 0,
    },
    // Only 1 remaining finding in the rescan
    findings: [mockSampleScanRun.findings[2]],
    gate: 'fail',
  },
  comparison: {
    comparable: true,
    remaining_ids: ['fnd_003_contrast_subtext'],
    newly_detected_ids: [],
    no_longer_detected_ids: [
      'fnd_001_img_hero',
      'fnd_002_btn_icon',
      'fnd_004_input_label',
      'fnd_005_empty_link',
      'fnd_006_html_lang',
    ],
    uncertain_baseline_ids: ['fnd_007_contrast_footer'],
    notes: [
      '5 violations are no longer detected after applying proposed HTML/ARIA fixes.',
      'Target for fnd_007_contrast_footer could not be unambiguously matched due to footer component structure change. Classified conservatively as UNCERTAIN.',
      '1 violation (fnd_003_contrast_subtext) remains detected with contrast ratio 2.82:1.',
    ],
  },
  gate: 'fail',
  completion_claim:
    'Fresh verification scan completed under identical conditions. 5 issues resolved, 1 uncertain, 1 remaining.',
};


export const berkshireHathawayScanRun: ScanRun = {
  schema_version: '1.0',
  run_id: 'run_brk_7719a4e08c',
  execution: 'completed',
  started_at: '2026-10-24T10:05:40.110Z',
  completed_at: '2026-10-24T10:05:42.340Z',
  duration_ms: 2230,
  requested_url: 'https://www.berkshirehathaway.com/',
  final_url: 'https://www.berkshirehathaway.com/',
  page_title: 'BERKSHIRE HATHAWAY INC.',
  score: 48,
  score_grade: 'F (Non-Compliant)',
  conditions: {
    viewport: { width: 1280, height: 800 },
    color_scheme: 'light',
    browser_locale: 'en-US',
    readiness_selector: null,
    scope: 'full_page',
  },
  engine: {
    axe_version: '4.10.2',
    playwright_version: '1.49.0',
    rule_ids: [
      'color-contrast',
      'image-alt',
      'label',
      'link-name',
      'button-name',
      'html-has-lang',
      'meta-viewport',
      'page-has-heading-one',
      'table-fake-heading',
    ],
    ruleset_fingerprint: 'sha256-brk8820c74fb91e',
  },
  coverage: {
    categories: [
      'Text contrast',
      'Image alternatives',
      'Link names',
      'Document language',
      'Viewport & reflow',
      'Heading semantics',
      'Table semantics',
    ],
    evaluated_rule_ids: [
      'color-contrast',
      'image-alt',
      'link-name',
      'html-has-lang',
      'meta-viewport',
      'page-has-heading-one',
    ],
    inapplicable_rule_ids: ['label', 'button-name', 'select-name'],
    incomplete_rule_ids: ['color-contrast'],
    current_rendered_state_only: true,
    frame_coverage: 'main_document_only',
  },
  counts: {
    violation_rule_count: 7,
    violation_node_count: 8,
    incomplete_node_count: 2,
    returned_finding_count: 8,
    omitted_finding_count: 0,
  },
  findings: [
    {
      id: 'brk_fnd_001_html_lang',
      rule_id: 'html-has-lang',
      impact: 'serious',
      description: '<html> element must have a lang attribute',
      help: 'Ensure every HTML document specifies a valid primary language attribute',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/html-has-lang',
      wcag_tags: ['wcag2a', 'wcag311'],
      targets: ['html'],
      html: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">\n<html><head><title>BERKSHIRE HATHAWAY INC.</title>',
      failure_summary: 'The <html> element does not have a lang attribute',
      guidance:
        'Declare a valid primary language based on page content and locale (e.g. <html lang="en">). Do not leave root unassigned.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'Screen readers use the <html> lang attribute to select the correct speech synthesizer dictionary and phonetics. Because Berkshire Hathaway lacks a lang attribute, multi-lingual assistive tools cannot determine whether English, Spanish, or another synthesis model should read the text.',
      suggested_code_diff: {
        before: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">\n<html>',
        after: '<!DOCTYPE html>\n<html lang="en">',
      },
    },
    {
      id: 'brk_fnd_002_empty_bookmarks',
      rule_id: 'link-name',
      impact: 'critical',
      description: 'Links must have discernible text',
      help: 'Ensure all anchor elements have accessible names and text content',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/link-name',
      wcag_tags: ['wcag2a', 'wcag412', 'wcag244'],
      targets: ['body > font > p > a:nth-child(1)'],
      html: '<p><a name="LETTERS"><a name="OWNER"><a name="STOCKCLASS"><a name=LINKS></a></a></a></a>If you have any comments about our WEB page...</p>',
      failure_summary:
        'Fix any of the following:\n  Element is in tab order and does not have accessible text\n  4 nested empty named anchor tags without content',
      guidance:
        'Legacy <a name="..."> tags are obsolete and act as ghost focus targets. Remove empty anchor tags and assign id attributes to semantic elements instead.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'Berkshire Hathaway uses 1990s HTML 3.2 named bookmarks (<a name="LETTERS">). Modern browsers treat <a> tags as potential interactive controls. When screen-reader or keyboard users tab across the page, these empty tags create multiple blank tab stops with no announcement.',
      suggested_code_diff: {
        before: '<p><a name="LETTERS"><a name="OWNER"><a name="STOCKCLASS"><a name=LINKS></a></a></a></a>If you have any comments about our WEB page...</p>',
        after: '<p id="comments-section">If you have any comments about our WEB page...</p>',
      },
    },
    {
      id: 'brk_fnd_003_vlink_contrast',
      rule_id: 'color-contrast',
      impact: 'serious',
      description: 'Visited link color fails WCAG 2.1 AA minimum contrast (4.5:1)',
      help: 'Ensure contrast between visited text color and background meets WCAG AA standards',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/color-contrast',
      wcag_tags: ['wcag2aa', 'wcag143'],
      targets: ['body'],
      html: '<body link="#800080" bgcolor="#ffffff" text="#000080" vlink="#ff0000">',
      failure_summary:
        'Element has insufficient color contrast of 3.99:1 (vlink foreground color: #ff0000 red, background color: #ffffff white). Expected at least 4.5:1.',
      guidance:
        'Adjust the visited link color token from bright red (#ff0000) to a deeper shade such as #c00000 or #990000 (contrast >= 5.8:1) to satisfy WCAG AA on white background.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'The inline body attribute vlink="#ff0000" causes all visited links on Berkshire Hathaway to turn pure red. Against the white background, this fails the 4.5:1 ratio and is difficult to distinguish for users with color vision deficiency (protanopia/deuteranopia).',
      suggested_code_diff: {
        before: '<body link="#800080" bgcolor="#ffffff" text="#000080" vlink="#ff0000">',
        after: '<body style="background-color: #ffffff; color: #000080;" class="visited:text-[#990000]">',
      },
    },
    {
      id: 'brk_fnd_004_missing_viewport',
      rule_id: 'meta-viewport',
      impact: 'critical',
      description: 'Page lacks responsive viewport definition (WCAG 1.4.10 Reflow)',
      help: 'Add a meta viewport tag to enable mobile responsiveness and zoom reflow',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/meta-viewport',
      wcag_tags: ['wcag21aa', 'wcag1410', 'wcag144'],
      targets: ['head'],
      html: '<head><title>BERKSHIRE HATHAWAY INC.</title>\n<meta content="text/html; charset=unicode" http-equiv="Content-Type">\n<meta name="GENERATOR" content="MSHTML 8.00.6001.18828"></head>',
      failure_summary:
        'Document does not contain <meta name="viewport"> tag. Layout cannot scale or reflow on mobile viewports.',
      guidance:
        'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside <head> to enable fluid responsive reflow without horizontal scrolling.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'Without a viewport meta tag, mobile devices render Berkshire Hathaway at a simulated 980px desktop width, resulting in unreadable sub-4px font rendering and forcing low-vision users to perform continuous horizontal panning.',
      suggested_code_diff: {
        before: '<head><title>BERKSHIRE HATHAWAY INC.</title>\n<meta content="text/html; charset=unicode" http-equiv="Content-Type">',
        after: '<head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>BERKSHIRE HATHAWAY INC.</title>',
      },
    },
    {
      id: 'brk_fnd_005_missing_h1',
      rule_id: 'page-has-heading-one',
      impact: 'moderate',
      description: 'Page must contain a level-one heading (h1)',
      help: 'Ensure page has a top-level <h1> heading to establish document hierarchy',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/page-has-heading-one',
      wcag_tags: ['wcag2a', 'wcag131', 'wcag246'],
      targets: ['body > b:nth-child(1) > p'],
      html: '<b><font size="6"><p align="center">B</font><font size="4">ERKSHIRE </font><font size="6">H</font><font size=4>ATHAWAY </font><font size="2">INC.<br>3555 Farnam Street<br>Omaha, NE 68131</font><br>Official Home Page</b>',
      failure_summary:
        'No <h1> heading found on the page. Visual hierarchy is simulated with presentational <font> and <b> tags.',
      guidance:
        'Replace presentational <font> tags with a semantic <h1> heading element representing the main document title: <h1>BERKSHIRE HATHAWAY INC.</h1>.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'Screen reader users frequently press the H key or open rotor heading lists to explore page structure. Because Berkshire Hathaway uses presentational <font size="6"> tags instead of <h1>, screen reader users cannot find the page title or navigate the document outline.',
      suggested_code_diff: {
        before: '<b><font size="6"><p align="center">B</font><font size="4">ERKSHIRE </font><font size="6">H</font><font size=4>ATHAWAY </font><font size="2">INC.<br>3555 Farnam Street<br>Omaha, NE 68131</font><br>Official Home Page</b>',
        after: '<header class="text-center my-6">\n  <h1 class="text-3xl font-bold tracking-tight">BERKSHIRE HATHAWAY INC.</h1>\n  <address class="text-sm not-italic text-zinc-600 mt-1">3555 Farnam Street, Omaha, NE 68131</address>\n  <p class="text-xs font-semibold text-zinc-500 uppercase mt-0.5">Official Home Page</p>\n</header>',
      },
    },
    {
      id: 'brk_fnd_006_table_presentation',
      rule_id: 'table-presentation',
      impact: 'serious',
      description: 'Layout table must specify role="presentation" or role="none"',
      help: 'Ensure tables used for visual layout do not announce data table semantics',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/table-fake-heading',
      wcag_tags: ['wcag2a', 'wcag131', 'wcag412'],
      targets: ['center > table'],
      html: '<table border="0" cellspacing="0" width="90%">\n  <tbody>\n  <tr>\n    <td height="55" valign="top" width="50%">\n      <ul>\n        <li><a href="message.html">A Message from Warren E. Buffett</a></li>\n      </ul>\n    </td>...',
      failure_summary:
        'Table is used for multi-column page layout without role="presentation". Assistive tech announces 8 rows and 2 columns.',
      guidance:
        'Add role="presentation" to the <table> tag, or refactor the two-column link grid to CSS flexbox/grid so assistive tools do not treat links as tabular dataset coordinates.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'When screen readers encounter this <table>, they announce: "Table with 8 rows and 2 columns". Screen reader users are forced to use table cell navigation shortcuts instead of reading links in natural reading flow.',
      suggested_code_diff: {
        before: '<table border="0" cellspacing="0" width="90%">',
        after: '<table role="presentation" border="0" cellspacing="0" width="90%">',
      },
    },
    {
      id: 'brk_fnd_007_empty_list',
      rule_id: 'list',
      impact: 'moderate',
      description: 'List element <ul> must not be empty',
      help: 'Ensure all <ul> and <ol> containers contain valid <li> items',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/list',
      wcag_tags: ['wcag2a', 'wcag131'],
      targets: ['table > tbody > tr:nth-child(7) > td:nth-child(2) > ul'],
      html: '<td height="55" valign="top" width="50%">\n  <ul>\n  </ul>\n</td>',
      failure_summary: '<ul> element contains no <li> child items.',
      guidance:
        'Remove empty <ul> tags or ensure each contains at least one meaningful <li> item.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'Screen readers announce: "List: 0 items", causing confusion about whether shareholder information or sublinks failed to download.',
      suggested_code_diff: {
        before: '<td height="55" valign="top" width="50%">\n  <ul>\n  </ul>\n</td>',
        after: '<td height="55" valign="top" width="50%"></td>',
      },
    },
    {
      id: 'brk_fnd_008_pdf_link',
      rule_id: 'link-name',
      impact: 'minor',
      description: 'Links to downloadable PDF files should indicate file format',
      help: 'Ensure users are notified when clicking a link initiates a binary file download',
      help_url: 'https://dequeuniversity.com/rules/axe/4.10/link-name',
      wcag_tags: ['wcag2a', 'wcag244'],
      targets: ['table > tbody > tr:nth-child(1) > td:nth-child(2) a[href="webfraud.pdf"]'],
      html: '<li><a href="webfraud.pdf">Fraudulent Claims Regarding Mr. Buffett\'s Endorsements of Investment Products and Political Candidates</a></li>',
      failure_summary:
        'Link opens an external binary PDF without text indicator or aria-label.',
      guidance:
        'Append "(PDF)" to link text or provide aria-label="... (PDF download)" so assistive technologies announce document format before navigation.',
      guidance_source: 'rule_registry',
      requires_context: false,
      ai_insight:
        'Users on mobile or using screen magnification may have their browser session unexpectedly disrupted when a large PDF opens. Adding an accessible indicator preserves cognitive predictability.',
      suggested_code_diff: {
        before: '<a href="webfraud.pdf">Fraudulent Claims Regarding Mr. Buffett\'s Endorsements of Investment Products and Political Candidates</a>',
        after: '<a href="webfraud.pdf" aria-label="Fraudulent Claims Regarding Mr. Buffett\'s Endorsements (PDF document)">Fraudulent Claims Regarding Mr. Buffett\'s Endorsements of Investment Products and Political Candidates (PDF)</a>',
      },
    },
  ],
  review_items: [
    {
      rule_id: 'color-contrast',
      targets: ['body > p > font[size="1"]'],
      reason:
        'Inline <font size="1"> renders subtext at 9.5px, which requires manual review for minimum body legibility and reading comfort under standard magnification.',
      html: '<font size="1">FOR A FREE CAR INSURANCE RATE QUOTE THAT COULD SAVE YOU SUBSTANTIAL MONEY<br><a href="http://www.geico.com/">WWW.GEICO.COM</a> OR CALL 1-888-395-6349, 24 HOURS A DAY</font>',
    },
    {
      rule_id: 'meta-charset',
      targets: ['head > meta[content*="charset=unicode"]'],
      reason:
        'Obsolete "charset=unicode" header can cause ambiguous encoding fallback in non-Windows user agents. Manual character decoding review advised.',
      html: '<meta content="text/html; charset=unicode" http-equiv="Content-Type">',
    },
  ],
  gate: 'fail',
  details_truncated: false,
  report_path: '/tmp/glorp_runs/run_brk_7719a4e08c.json',
  warnings: [],
  limitations: [
    'Main document only; cross-origin frames not traversed in P0',
    'Tested against live rendered DOM structure of https://www.berkshirehathaway.com/',
  ],
};

export const berkshireHathawayVerificationResult: VerificationResult = {
  schema_version: '1.0',
  baseline_id: 'run_brk_7719a4e08c',
  current_run: {
    ...berkshireHathawayScanRun,
    run_id: 'run_brk_verify_89b21a3',
    started_at: '2026-10-24T10:08:12.110Z',
    completed_at: '2026-10-24T10:08:13.980Z',
    duration_ms: 1870,
    score: 86,
    score_grade: 'B (Substantially Remediated)',
    counts: {
      violation_rule_count: 1,
      violation_node_count: 1,
      incomplete_node_count: 1,
      returned_finding_count: 1,
      omitted_finding_count: 0,
    },
    // Only 1 remaining finding in the rescan
    findings: [berkshireHathawayScanRun.findings[5]], // table presentation still in progress
    gate: 'fail',
  },
  comparison: {
    comparable: true,
    remaining_ids: ['brk_fnd_006_table_presentation'],
    newly_detected_ids: [],
    no_longer_detected_ids: [
      'brk_fnd_001_html_lang',
      'brk_fnd_002_empty_bookmarks',
      'brk_fnd_003_vlink_contrast',
      'brk_fnd_004_missing_viewport',
      'brk_fnd_005_missing_h1',
      'brk_fnd_007_empty_list',
    ],
    uncertain_baseline_ids: ['brk_fnd_008_pdf_link'],
    notes: [
      '6 violations are no longer detected after applying HTML5 doctype, lang="en", meta viewport, h1 heading, and removing empty bookmark anchors.',
      'Target for webfraud.pdf download link was restructured; classified conservatively as UNCERTAIN pending user journey check.',
      '1 violation (brk_fnd_006_table_presentation) persists until table layout is refactored with role="presentation".',
    ],
  },
  gate: 'fail',
  completion_claim:
    'Fresh verification scan completed under identical conditions. 6 issues resolved, 1 uncertain, 1 remaining.',
};
