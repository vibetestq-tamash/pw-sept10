import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import * as fs from 'node:fs';
import * as path from 'node:path';

type StepSummary = {
  title: string;
  category: string;
  durationMs: number;
  status: string;
  error?: string;
};

type TestSummary = {
  id: string;
  title: string;
  file: string;
  durationMs: number;
  status: string;
  retries: number;
  error?: string;
  ruleMatches: string[];
  steps: StepSummary[];
};

type RunSummary = {
  id: string;
  timestamp: string;
  durationMs: number;
  status: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  projectNames: string[];
  tests: TestSummary[];
};

const HISTORY_FILE = 'report-history.json';
const REPORT_FILE = 'my-awesome-report.html';
const MAX_HISTORY = 50;

function readHistory(filePath: string): RunSummary[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown[];
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is RunSummary =>
            typeof item === 'object' &&
            item !== null &&
            'id' in item &&
            'projectNames' in item &&
            'tests' in item
        )
      : [];
  } catch {
    return [];
  }
}

function classifyFailure(message: string): string[] {
  if (!message) return [];

  const checks: Array<[RegExp, string]> = [
    [/timeout|timed out|waiting for selector|waiting for locator/i, 'Timeout'],
    [/locator|selector|getBy\(|getByRole\(|page\.getBy|not found/i, 'Selector'],
    [/element is not visible|not visible|hidden|detached from DOM/i, 'Visibility'],
    [/network|fetch|api|500|404|403|ECONNREFUSED|ERR_HTTP|ENOTFOUND/i, 'Network'],
    [/expected .* to|expect\(|received|assertion/i, 'Assertion'],
    [/permission|access denied|not allowed|browser has no permission/i, 'Permission'],
  ];

  const matches = checks.filter(([pattern]) => pattern.test(message)).map(([, label]) => label);
  return matches;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTrendSvg(runs: RunSummary[]): string {
  if (runs.length === 0) return '<div style="color:#94a3b8">No runs yet</div>';

  const points = runs.slice(-12);
  const maxTests = Math.max(1, ...points.map((r) => r.total));
  const width = 400;
  const height = 150;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  let pathPass = '';
  let pathFail = '';

  points.forEach((run, idx) => {
    const x = padding + (idx / Math.max(1, points.length - 1)) * chartWidth;
    const yPass = padding + chartHeight - (run.passed / maxTests) * chartHeight;
    const yFail = padding + chartHeight - (run.failed / maxTests) * chartHeight;

    pathPass += `${idx === 0 ? 'M' : 'L'} ${x} ${yPass} `;
    pathFail += `${idx === 0 ? 'M' : 'L'} ${x} ${yFail} `;
  });

  return `<svg width="${width}" height="${height}" style="border:1px solid #2b374a;border-radius:8px">
    <defs>
      <linearGradient id="grad-pass" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#22c55e;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#22c55e;stop-opacity:0.1" />
      </linearGradient>
      <linearGradient id="grad-fail" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#ef4444;stop-opacity:0.1" />
      </linearGradient>
    </defs>
    <path d="${pathPass}" stroke="#22c55e" stroke-width="2" fill="none" />
    <path d="${pathFail}" stroke="#ef4444" stroke-width="2" fill="none" />
  </svg>`;
}

function renderHtml(history: RunSummary[]): string {
  const validHistory = history.filter(
    (r) => r && r.projectNames && Array.isArray(r.tests)
  );
  const latest = validHistory[validHistory.length - 1] || null;

  const failureMap = new Map<string, number>();
  validHistory.forEach((run) => {
    run.tests.forEach((test) => {
      if (test.status === 'failed' || test.status === 'timedOut') {
        test.ruleMatches.forEach((rule) => {
          failureMap.set(rule, (failureMap.get(rule) || 0) + 1);
        });
      }
    });
  });

  const topFailures = [...failureMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const summaryHtml = [
    `<div class="card"><h3>Total</h3><div class="value">${latest?.total || 0}</div></div>`,
    `<div class="card"><h3>Passed</h3><div class="value" style="color:#22c55e">${latest?.passed || 0}</div></div>`,
    `<div class="card"><h3>Failed</h3><div class="value" style="color:#ef4444">${latest?.failed || 0}</div></div>`,
    `<div class="card"><h3>Skipped</h3><div class="value" style="color:#f59e0b">${latest?.skipped || 0}</div></div>`,
  ].join('');

  const trendSvg = renderTrendSvg(validHistory);

  const runsHtml = validHistory
    .slice()
    .reverse()
    .map(
      (run) =>
        `<div class="run-card" onclick="selectRun('${escapeHtml(run.id)}')" id="run-${escapeHtml(run.id)}">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <strong>${escapeHtml(run.id.substring(0, 20))}</strong>
          <span class="status-badge status-${run.status === 'passed' ? 'pass' : 'fail'}">${escapeHtml(run.status)}</span>
        </div>
        <div style="font-size:11px;color:#94a3b8;line-height:1.6">
          ${escapeHtml(new Date(run.timestamp).toLocaleString())}<br>
          ${run.total} tests | ${run.passed}✓ ${run.failed}✗ ${run.skipped}⊘<br>
          Projects: ${escapeHtml(run.projectNames.join(', '))}
        </div>
      </div>`
    )
    .join('');

  const testDetailsHtml = latest
    ? latest.tests
        .map(
          (test) =>
            `<div class="test-card" onclick="selectTest('${escapeHtml(test.id)}')" id="test-${escapeHtml(test.id)}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <strong style="font-size:13px">${escapeHtml(test.title)}</strong>
            <span class="status-badge status-${test.status === 'passed' ? 'pass' : test.status === 'skipped' ? 'skip' : 'fail'}">${escapeHtml(test.status)}</span>
          </div>
          <div style="font-size:11px;color:#94a3b8">
            ${escapeHtml(test.file.split('/').pop() || test.file)}<br>
            ${(test.durationMs / 1000).toFixed(2)}s · retries: ${test.retries}
          </div>
          ${
            test.ruleMatches.length
              ? '<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">' +
                test.ruleMatches
                  .map((rule) => `<span class="tag">${escapeHtml(rule)}</span>`)
                  .join('') +
                '</div>'
              : ''
          }
        </div>`
        )
        .join('')
    : '<div style="color:#94a3b8">No tests in latest run</div>';

  const failureAnalysisHtml = topFailures
    .map(
      ([rule, count]) =>
        `<div class="analysis-row">
        <strong>${escapeHtml(rule)}</strong>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:4px;padding:4px 8px;font-weight:700;color:#fca5a5">${count}</div>
          <div style="background:#ef4444;height:8px;border-radius:4px;width:${Math.min(count * 20, 200)}px"></div>
        </div>
      </div>`
    )
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>My Awesome Playwright Reporter</title>
  <style>
    :root {
      --bg: #0f172a;
      --panel: #111827;
      --panel-alt: #1f2937;
      --border: #2b374a;
      --muted: #94a3b8;
      --text: #e5e7eb;
      --pass: #22c55e;
      --fail: #ef4444;
      --warn: #f59e0b;
      --info: #38bdf8;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 24px;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 12px;
    }

    .title { margin: 0; font-size: 32px; font-weight: 700; }
    .subtitle { color: var(--muted); font-size: 13px; }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 12px;
    }

    .tab {
      padding: 8px 16px;
      background: transparent;
      border: none;
      color: var(--muted);
      cursor: pointer;
      font-weight: 600;
      border-bottom: 2px solid transparent;
      font-size: 13px;
      transition: all 0.2s;
    }

    .tab:hover { color: var(--text); }
    .tab.active { color: var(--info); border-bottom-color: var(--info); }

    .panel { display: none; }
    .panel.active { display: block; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
    }

    .card h3 {
      margin: 0 0 8px 0;
      font-size: 11px;
      letter-spacing: 0.08em;
      color: var(--muted);
      text-transform: uppercase;
    }

    .value { font-size: 28px; font-weight: 700; line-height: 1; }

    .layout {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 16px;
    }

    .list { display: grid; gap: 8px; max-height: 500px; overflow-y: auto; padding-right: 8px; }
    .list::-webkit-scrollbar { width: 6px; }
    .list::-webkit-scrollbar-track { background: transparent; }
    .list::-webkit-scrollbar-thumb { background: #2b374a; border-radius: 3px; }

    .run-card, .test-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .run-card:hover, .test-card:hover {
      border-color: var(--info);
      box-shadow: 0 0 0 1px var(--info);
    }

    .run-card.selected, .test-card.selected {
      background: var(--panel-alt);
      border-color: var(--info);
      box-shadow: 0 0 0 1px var(--info);
    }

    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .status-pass { background: rgba(34, 197, 94, 0.15); color: #86efac; }
    .status-fail { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
    .status-skip { background: rgba(245, 158, 11, 0.15); color: #fcd34d; }

    .tag {
      display: inline-block;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #bae6fd;
      border-radius: 6px;
      padding: 3px 6px;
      font-size: 10px;
    }

    .detail-view {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      max-height: 600px;
      overflow-y: auto;
    }

    .detail-view::-webkit-scrollbar { width: 6px; }
    .detail-view::-webkit-scrollbar-thumb { background: #2b374a; border-radius: 3px; }

    .step-item {
      background: var(--panel-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 8px;
      font-size: 12px;
    }

    .step-title { font-weight: 600; margin-bottom: 4px; }
    .step-meta { color: var(--muted); font-size: 11px; margin-bottom: 6px; }
    .step-error { background: rgba(239, 68, 68, 0.08); border-left: 2px solid #ef4444; padding: 6px; border-radius: 4px; color: #fca5a5; white-space: pre-wrap; word-break: break-word; font-size: 11px; font-family: monospace; }

    .error-box {
      background: rgba(239, 68, 68, 0.08);
      border-left: 3px solid #ef4444;
      border-radius: 4px;
      padding: 10px;
      margin-top: 10px;
      color: #fca5a5;
      font-size: 11px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .analysis-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid var(--border);
      gap: 12px;
    }

    .analysis-row:last-child { border-bottom: none; }

    @media (max-width: 1024px) {
      .layout { grid-template-columns: 1fr; }
      .grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      .grid { grid-template-columns: 1fr; }
      .tabs { flex-wrap: wrap; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <h1 class="title">My Awesome Reporter</h1>
      <p class="subtitle">${validHistory.length} run${validHistory.length !== 1 ? 's' : ''} recorded</p>
    </div>
  </div>

  <div class="tabs">
    <button class="tab active" onclick="switchTab('dashboard')">Dashboard</button>
    <button class="tab" onclick="switchTab('runs')">Runs</button>
    <button class="tab" onclick="switchTab('details')">Test Details</button>
    <button class="tab" onclick="switchTab('analysis')">Failure Analysis</button>
  </div>

  <div id="dashboard" class="panel active">
    <div class="grid">${summaryHtml}</div>
    <div class="card">
      <h3>Trend (Last 12 Runs)</h3>
      ${trendSvg}
    </div>
  </div>

  <div id="runs" class="panel">
    <div class="layout">
      <div><h3 style="margin-top:0;margin-bottom:12px">Run History</h3><div class="list">${runsHtml}</div></div>
      <div>
        <h3 style="margin-top:0;margin-bottom:12px">Run Details</h3>
        <div id="runDetail" class="detail-view">
          <div style="color:var(--muted)">Select a run to view details</div>
        </div>
      </div>
    </div>
  </div>

  <div id="details" class="panel">
    <div class="layout">
      <div><h3 style="margin-top:0;margin-bottom:12px">Tests</h3><div class="list">${testDetailsHtml}</div></div>
      <div>
        <h3 style="margin-top:0;margin-bottom:12px">Test Steps</h3>
        <div id="testDetail" class="detail-view">
          <div style="color:var(--muted)">Select a test to view steps</div>
        </div>
      </div>
    </div>
  </div>

  <div id="analysis" class="panel">
    <div class="card">
      <h3>Failure Categories</h3>
      <div style="margin-top:12px">${failureAnalysisHtml || '<div style="color:var(--muted)">No failures recorded</div>'}</div>
    </div>
  </div>

  <script>
    const history = ${JSON.stringify(validHistory)};
    let selectedRunId = null;
    let selectedTestId = null;

    function switchTab(tab) {
      document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.getElementById(tab).classList.add('active');
      event.target.classList.add('active');
    }

    function selectRun(runId) {
      selectedRunId = runId;
      document.querySelectorAll('.run-card').forEach((c) => c.classList.remove('selected'));
      document.getElementById('run-' + runId)?.classList.add('selected');

      const run = history.find((r) => r.id === runId);
      if (!run) return;

      const detail = \`
        <div>
          <div style="margin-bottom:12px">
            <strong style="font-size:13px">Run ID:</strong> \${run.id}<br>
            <strong>Timestamp:</strong> \${new Date(run.timestamp).toLocaleString()}<br>
            <strong>Duration:</strong> \${(run.durationMs / 1000).toFixed(2)}s<br>
            <strong>Projects:</strong> \${run.projectNames.join(', ')}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px">
            <div style="background:rgba(34,197,94,0.1);padding:8px;border-radius:6px;text-align:center">
              <div style="font-size:18px;font-weight:700;color:#86efac">\${run.passed}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px">PASSED</div>
            </div>
            <div style="background:rgba(239,68,68,0.1);padding:8px;border-radius:6px;text-align:center">
              <div style="font-size:18px;font-weight:700;color:#fca5a5">\${run.failed}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px">FAILED</div>
            </div>
            <div style="background:rgba(245,158,11,0.1);padding:8px;border-radius:6px;text-align:center">
              <div style="font-size:18px;font-weight:700;color:#fcd34d">\${run.skipped}</div>
              <div style="font-size:10px;color:var(--muted);margin-top:2px">SKIPPED</div>
            </div>
          </div>
        </div>
      \`;
      document.getElementById('runDetail').innerHTML = detail;
    }

    function selectTest(testId) {
      selectedTestId = testId;
      document.querySelectorAll('.test-card').forEach((c) => c.classList.remove('selected'));
      document.getElementById('test-' + testId)?.classList.add('selected');

      const run = history.find((r) => r.id === selectedRunId) || history[history.length - 1];
      if (!run) return;

      const test = run.tests.find((t) => t.id === testId);
      if (!test) return;

      const stepsHtml = test.steps
        .map(
          (step) => \`
          <div class="step-item">
            <div class="step-title">\${step.title}</div>
            <div class="step-meta">
              <strong>\${step.category}</strong> · \${(step.durationMs / 1000).toFixed(2)}s · <span style="color:\${step.status === 'passed' ? '#86efac' : '#fca5a5'}">\${step.status}</span>
            </div>
            \${step.error ? '<div class="step-error">' + step.error + '</div>' : ''}
          </div>
        \`
        )
        .join('');

      const detail = \`
        <div>
          <strong style="font-size:13px">\${test.title}</strong><br>
          <div style="color:var(--muted);font-size:11px;margin:8px 0">\${test.file}</div>
          <div style="margin:12px 0">
            <strong>Status:</strong> <span style="color:\${test.status === 'passed' ? '#86efac' : '#fca5a5'}">\${test.status}</span><br>
            <strong>Duration:</strong> \${(test.durationMs / 1000).toFixed(2)}s<br>
            <strong>Retries:</strong> \${test.retries}
          </div>
          \${test.ruleMatches.length ? '<div style="margin:12px 0;display:flex;flex-wrap:wrap;gap:4px">' + test.ruleMatches.map((r) => '<span class="tag">' + r + '</span>').join('') + '</div>' : ''}
          \${test.error ? '<div class="error-box">' + test.error + '</div>' : ''}
          \${stepsHtml ? '<div style="margin-top:14px"><strong>Steps:</strong><div style="margin-top:8px">' + stepsHtml + '</div></div>' : ''}
        </div>
      \`;
      document.getElementById('testDetail').innerHTML = detail;
    }

    if (history.length > 0) {
      const firstRun = history[history.length - 1];
      selectRun(firstRun.id);
      if (firstRun.tests.length > 0) {
        selectTest(firstRun.tests[0].id);
      }
    }
  </script>
</body>
</html>`;
}

class MyAwesomeReporter implements Reporter {
  private run: RunSummary | undefined;

  onBegin(config: FullConfig, suite: Suite) {
    const projectNames = config.projects.map((p) => p.name);

    this.run = {
      id: `run-${Date.now()}`,
      timestamp: new Date().toISOString(),
      durationMs: 0,
      status: 'running',
      total: suite.allTests().length,
      passed: 0,
      failed: 0,
      skipped: 0,
      projectNames,
      tests: [],
    };
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (!this.run) return;

    const steps = (result.steps ?? []).map((step) => ({
      title: step.title,
      category: step.category,
      durationMs: step.duration,
      status: step.error ? 'failed' : 'passed',
      error: step.error?.message,
    }));

    const testRecord: TestSummary = {
      id: test.id,
      title: test.title,
      file: test.location.file,
      durationMs: result.duration,
      status: result.status,
      retries: result.retry,
      error: result.error?.message,
      ruleMatches: classifyFailure(result.error?.message ?? ''),
      steps,
    };

    this.run.tests.push(testRecord);

    if (result.status === 'passed') {
      this.run.passed += 1;
    } else if (result.status === 'skipped') {
      this.run.skipped += 1;
    } else {
      this.run.failed += 1;
    }
  }

  onEnd(result: FullResult) {
    if (!this.run) return;

    this.run.durationMs = result.duration;
    this.run.status = result.status;
    this.run.total = this.run.tests.length;

    const historyPath = path.join(process.cwd(), HISTORY_FILE);
    const existing = readHistory(historyPath);
    const history = [...existing, this.run].slice(-MAX_HISTORY);

    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf8');

    const reportPath = path.join(process.cwd(), REPORT_FILE);
    fs.writeFileSync(reportPath, renderHtml(history), 'utf8');

    console.log(`[my-awesome-reporter] Generated ${REPORT_FILE} and ${HISTORY_FILE}`);
  }
}

export default MyAwesomeReporter;
