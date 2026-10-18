import {
  Activity,
  AlertCircle,
  ArrowLeftRight,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BadgeIndianRupee,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  DatabaseZap,
  Download,
  FileSpreadsheet,
  FileCheck2,
  FileText,
  Filter,
  FolderOpen,
  Gauge,
  GitCompareArrows,
  Inbox,
  Languages,
  Landmark,
  Link2,
  Layers3,
  Menu,
  Monitor,
  MoreHorizontal,
  Moon,
  Plus,
  Radar,
  ReceiptText,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  TriangleAlert,
  Upload,
  UserRound,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme, type Theme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  changeWatch,
  evidence as seededEvidence,
  buildAuditCsv,
  evaluationSummary,
  findings,
  getEvidence,
  getKpis,
  initialActions,
  knownLimitations,
  parseUpload,
  retrievalBenchmarks,
  rulebook,
  gstChecks,
  integrationStatus,
  processScores,
  roiMetrics,
  threeWayMatches,
  vendorRisk,
  type ActionStatus,
  type CorrectiveAction,
  type Evidence,
  type Finding,
  type FindingStatus,
  type Severity,
} from "@/lib/opsdrift-data";

type Section = "overview" | "findings" | "actions" | "evidence" | "monitoring" | "india" | "evaluation";
type FilterValue = "all" | Severity;

const navItems: { id: Section; label: string; icon: typeof Activity; count?: string }[] = [
  { id: "overview", label: "Operations overview", icon: Radar },
  { id: "findings", label: "Drift findings", icon: ShieldAlert, count: "03" },
  { id: "actions", label: "Corrective actions", icon: ClipboardCheck, count: "04" },
  { id: "evidence", label: "Evidence library", icon: FolderOpen, count: "07" },
  { id: "monitoring", label: "Change monitor", icon: GitCompareArrows, count: "01" },
  { id: "india", label: "India controls", icon: BadgeIndianRupee, count: "09" },
  { id: "evaluation", label: "Evaluation lab", icon: BarChart3, count: "48" },
];

const severityMeta: Record<Severity, { label: string; className: string }> = {
  critical: { label: "Critical", className: "severity-critical" },
  high: { label: "High", className: "severity-high" },
  medium: { label: "Medium", className: "severity-medium" },
  low: { label: "Low", className: "severity-low" },
};

function SeverityBadge({ severity }: { severity: Severity }) {
  const meta = severityMeta[severity];
  return <span className={`severity-badge ${meta.className}`}>{meta.label}</span>;
}

function StatusPill({ status }: { status: ActionStatus | FindingStatus }) {
  const className = status === "complete" || status === "resolved" ? "status-complete" : status === "blocked" ? "status-blocked" : status === "watching" ? "status-watching" : "status-progress";
  const label = status === "in progress" ? "In progress" : status[0].toUpperCase() + status.slice(1);
  return <span className={`status-pill ${className}`}><span className="status-dot" />{label}</span>;
}

function SectionEyebrow({ children, icon: Icon = Activity }: { children: React.ReactNode; icon?: typeof Activity }) {
  return <div className="section-eyebrow"><Icon size={13} strokeWidth={2.4} />{children}</div>;
}

function MetricCard({ label, value, detail, trend, tone = "neutral", icon: Icon }: { label: string; value: string; detail: string; trend?: "up" | "down"; tone?: "neutral" | "rust" | "teal" | "amber"; icon: typeof Activity }) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <div className="metric-icon"><Icon size={16} /></div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className={`metric-detail ${trend === "up" ? "metric-trend-up" : trend === "down" ? "metric-trend-down" : ""}`}>
        {trend === "up" ? <ArrowUpRight size={13} /> : trend === "down" ? <ArrowDownRight size={13} /> : null}
        {detail}
      </div>
    </article>
  );
}

function MiniBars() {
  const bars = [52, 68, 46, 78, 57, 88, 62, 73, 92, 68, 81, 97, 74, 86, 61, 79, 93, 71];
  return (
    <div className="mini-bars" aria-label="Weekly drift signals chart">
      {bars.map((height, index) => <span key={index} style={{ height: `${height}%` }} className={index > 14 ? "bar-hot" : ""} />)}
    </div>
  );
}

function FindingRow({ finding, onSelect }: { finding: Finding; onSelect: (finding: Finding) => void }) {
  return (
    <button className="finding-row" onClick={() => onSelect(finding)}>
      <span className="finding-number">{finding.index}</span>
      <span className="finding-copy">
        <span className="finding-row-top"><SeverityBadge severity={finding.severity} /><span className="finding-process">{finding.process}</span><span className="finding-time">{finding.detected}</span></span>
        <strong>{finding.title}</strong>
        <span className="finding-summary">{finding.summary}</span>
      </span>
      <span className="finding-row-meta"><span>{finding.evidenceIds.length} sources</span><span className="impact-text">{finding.impact}</span></span>
      <ChevronRight size={18} className="row-chevron" />
    </button>
  );
}

function ActionRow({ action, onComplete, onSelectFinding }: { action: CorrectiveAction; onComplete: (id: string) => void; onSelectFinding: (findingId: string) => void }) {
  const finding = findings.find(item => item.id === action.findingId);
  return (
    <div className={`action-row ${action.status === "complete" ? "action-complete" : ""}`}>
      <button className="action-check" onClick={() => onComplete(action.id)} aria-label={action.status === "complete" ? "Action complete" : "Mark action complete"}>
        {action.status === "complete" ? <Check size={15} /> : <span />}
      </button>
      <div className="action-main">
        <div className="action-title-line"><strong>{action.title}</strong><StatusPill status={action.status} /></div>
        <div className="action-subline"><span>{action.owner}</span><span>Due {action.dueDate}</span><button onClick={() => onSelectFinding(action.findingId)}>{finding?.process ?? "Finding"} <ChevronRight size={12} /></button></div>
        <div className="progress-track"><span style={{ width: `${action.progress}%` }} /></div>
      </div>
      <div className="action-impact"><span>{action.impact}</span><b>{action.progress}%</b></div>
      <button className="icon-button subtle" aria-label="More action options"><MoreHorizontal size={17} /></button>
    </div>
  );
}

function EvidenceCard({ item }: { item: Evidence }) {
  const icon = item.type === "policy" ? <FileCheck2 size={16} /> : item.type === "approval email" ? <Inbox size={16} /> : item.type === "vendor record" ? <UsersRound size={16} /> : <FileText size={16} />;
  return (
    <article className="evidence-card">
      <div className={`evidence-type-icon evidence-${item.type.replace(" ", "-")}`}>{icon}</div>
      <div className="evidence-card-copy"><div className="evidence-card-top"><strong>{item.name}</strong><span>{item.version}</span></div><p>{item.excerpt}</p><div className="evidence-card-meta"><span>{item.type}</span><span>{item.owner}</span><span>{item.date}</span></div></div>
      <button className="icon-button subtle"><MoreHorizontal size={17} /></button>
    </article>
  );
}

function RetrievalTrail({ finding }: { finding: Finding }) {
  return (
    <div className="retrieval-trail">
      <div className="trail-header"><span>How OpsDrift reached this finding</span><span className="mono-label">HYBRID-RAG / RERANKED</span></div>
      <div className="trail-steps">
        {finding.retrieval.map((stage, index) => (
          <div className="trail-step" key={stage.label}>
            <div className={`trail-mark trail-${stage.tone}`}>{index + 1}</div>
            <div><strong>{stage.label}</strong><span>{stage.detail}</span></div>
            <b>{stage.score}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function FindingDrawer({ finding, evidenceItems, onClose, onCreateAction }: { finding: Finding; evidenceItems: Evidence[]; onClose: () => void; onCreateAction: (finding: Finding) => void }) {
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="detail-drawer" onClick={event => event.stopPropagation()}>
        <div className="drawer-top"><span className="mono-label">FINDING / {finding.index}</span><button className="icon-button" onClick={onClose} aria-label="Close finding details"><X size={18} /></button></div>
        <div className="drawer-heading"><SeverityBadge severity={finding.severity} /><span className="finding-process">{finding.process}</span><h2>{finding.title}</h2><p>{finding.summary}</p></div>
        <div className="drawer-actions"><Button onClick={() => onCreateAction(finding)}><Plus size={15} />Create action</Button><Button variant="outline" onClick={onClose}>Keep watching</Button></div>
        <section className="drawer-section"><SectionEyebrow icon={FileCheck2}>Requirement</SectionEyebrow><p className="drawer-lead">{finding.requirement}</p></section>
        <section className="drawer-section observed-section"><SectionEyebrow icon={AlertCircle}>Observed reality</SectionEyebrow><p>{finding.reality}</p><div className="risk-box"><span className="risk-label">BUSINESS RISK</span><p>{finding.risk}</p></div></section>
        <section className="drawer-section"><SectionEyebrow icon={CircleHelp}>Likely root cause</SectionEyebrow><p>{finding.rootCause}</p></section>
        <section className="drawer-section"><SectionEyebrow icon={Zap}>Recommended next action</SectionEyebrow><p className="drawer-action-copy">{finding.action}</p><span className="impact-chip"><Gauge size={13} />{finding.impact}</span></section>
        <section className="drawer-section"><SectionEyebrow icon={Layers3}>Evidence chain</SectionEyebrow><div className="citation-stack">{finding.citations.map(citation => { const source = evidenceItems.find(item => item.id === citation.evidenceId); return <div className="citation" key={citation.evidenceId}><div className="citation-top"><span className="citation-index">{source?.type ?? "source"}</span><strong>{citation.label}</strong></div><p>“{citation.excerpt}”</p></div>; })}</div></section>
        <RetrievalTrail finding={finding} />
      </aside>
    </div>
  );
}

type LanguageMode = "English" | "हिन्दी";

function IndiaControls({ language, setLanguage, onNotice }: { language: LanguageMode; setLanguage: (language: LanguageMode) => void; onNotice: (message: string) => void }) {
  const hindi = language === "हिन्दी";
  const downloadAudit = () => {
    const blob = new Blob([buildAuditCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "opsdrift-audit-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    onNotice("Audit report downloaded as CSV.");
  };
  return (
    <section className="india-workspace">
      <div className="india-banner">
        <div><div className="india-banner-title"><BadgeIndianRupee size={19} /><span>{hindi ? "भारत अनुपालन नियंत्रण" : "India controls workspace"}</span><span className="beta-chip">MVP</span></div><p>{hindi ? "GST, TDS, vendor और invoice controls को एक evidence trail में लाएँ।" : "Bring GST, TDS, vendor, and invoice controls into one evidence trail."}</p></div>
        <div className="language-switch"><Languages size={14} /><button className={language === "English" ? "active" : ""} onClick={() => setLanguage("English")}>English</button><button className={language === "हिन्दी" ? "active" : ""} onClick={() => setLanguage("हिन्दी")}>हिन्दी</button></div>
      </div>
      <div className="roi-grid">{roiMetrics.map((metric, index) => <div className={`roi-card roi-${index}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.detail}</small></div>)}</div>
      <div className="india-grid india-grid-wide">
        <div className="content-card india-card"><div className="content-card-heading"><div><SectionEyebrow icon={ReceiptText}>GST / TDS CONTROL CHECKS</SectionEyebrow><h2>Tax signals before payment</h2></div><span className="control-count">2 review</span></div><div className="control-list">{gstChecks.map(check => <div className="control-row" key={check.id}><div className={`control-status control-${check.tone}`}>{check.tone === "teal" ? <CheckCircle2 size={15} /> : <TriangleAlert size={15} />}</div><div className="control-copy"><div><strong>{check.check}</strong><span>{check.invoice} · {check.vendor}</span></div><p>{check.detail}</p><div className="control-meta"><span>{check.amount}</span><span className={`control-state control-state-${check.tone}`}>{check.status}</span></div></div><ChevronRight size={15} className="control-chevron" /></div>)}</div><button className="full-list-button" onClick={() => onNotice("GST verification rules are ready for a real GSTIN API connector.")}>Configure GSTIN verification <ChevronRight size={15} /></button></div>
        <div className="content-card india-card"><div className="content-card-heading"><div><SectionEyebrow icon={ArrowLeftRight}>THREE-WAY MATCH</SectionEyebrow><h2>PO · receipt · invoice</h2></div><span className="control-count">2 exceptions</span></div><div className="match-summary"><div><strong>67%</strong><span>matched this month</span></div><div className="match-track"><span /></div><div className="match-summary-meta"><span>3 invoices sampled</span><b>₹4.49L</b></div></div><div className="match-table"><div className="match-table-head"><span>Invoice</span><span>Vendor</span><span>Exception</span><span>Value</span></div>{threeWayMatches.map(match => <div className="match-table-row" key={match.invoice}><span className="mono-label">{match.invoice}</span><span>{match.vendor}</span><span className={match.status === "matched" ? "match-ok" : "match-exception"}>{match.issue}</span><span>{match.value}</span></div>)}</div><button className="full-list-button" onClick={() => onNotice("Three-way matching is currently running on seeded records and CSV imports.")}>Open exception queue <ChevronRight size={15} /></button></div>
      </div>
      <div className="india-grid india-grid-wide">
        <div className="content-card india-card"><div className="content-card-heading"><div><SectionEyebrow icon={Building2}>VENDOR RISK</SectionEyebrow><h2>Know who needs review</h2></div><button className="text-button" onClick={() => onNotice("Vendor risk rules can be customized per supplier category.")}>Risk rules <ChevronRight size={14} /></button></div><div className="vendor-list">{vendorRisk.map(vendor => <div className="vendor-row" key={vendor.name}><div className="vendor-initial">{vendor.name[0]}</div><div className="vendor-copy"><strong>{vendor.name}</strong><span>{vendor.category}</span></div><div className={`risk-score risk-${vendor.score > 75 ? "high" : vendor.score > 50 ? "medium" : "low"}`}><b>{vendor.score}</b><span>/ 100 risk</span></div><div className="vendor-flag">{vendor.flags}</div></div>)}</div></div>
        <div className="content-card india-card process-score-card"><div className="content-card-heading"><div><SectionEyebrow icon={BarChart3}>PROCESS DRIFT SCORE</SectionEyebrow><h2>Control health by flow</h2></div></div><div className="score-list">{processScores.map(item => <div className="score-row" key={item.label}><div><span>{item.label}</span><small>{item.owner}</small></div><b>{item.score}</b><div className="score-track"><span className={item.score < 70 ? "score-low" : item.score < 80 ? "score-mid" : "score-good"} style={{ width: `${item.score}%` }} /></div></div>)}</div><div className="root-cause-note"><CircleHelp size={15} /><span><strong>Top root cause:</strong> conditional fields are missing from 2 forms.</span></div></div>
      </div>
      <div className="india-grid india-grid-wide">
        <div className="content-card india-card"><div className="content-card-heading"><div><SectionEyebrow icon={DatabaseZap}>CONNECT YOUR STACK</SectionEyebrow><h2>Start with exports, grow into integrations</h2></div></div><div className="integration-list">{integrationStatus.map(integration => <div className="integration-row" key={integration.name}><div className="integration-icon">{integration.icon === "spreadsheet" ? <FileSpreadsheet size={16} /> : integration.icon === "mail" ? <Inbox size={16} /> : <Landmark size={16} />}</div><div><strong>{integration.name}</strong><span>{integration.detail}</span></div><span className={`integration-status ${integration.status === "connected" ? "connected" : "planned"}`}>{integration.status === "connected" ? <Check size={12} /> : <Link2 size={12} />}{integration.status}</span></div>)}</div></div>
        <div className="content-card india-card audit-card"><SectionEyebrow icon={Download}>AUDIT-READY OUTPUT</SectionEyebrow><h2>Turn evidence into an audit pack.</h2><p>Export findings, source counts, severity, business impact, and detection time for internal or statutory review.</p><Button onClick={downloadAudit}><Download size={15} />Download CSV report</Button><span className="audit-note"><Check size={13} />No credentials required in this MVP</span></div>
      </div>
      <div className="india-footnote"><Sparkles size={14} /><span><strong>Built for Indian SMB workflows:</strong> the demo uses INR and CSV imports today; live GST, Tally, Zoho, email, and regional-language connectors are shown as integration-ready surfaces, not simulated live connections.</span></div>
    </section>
  );
}

function EvaluationLab({ onNotice }: { onNotice: (message: string) => void }) {
  return (
    <section className="evaluation-workspace">
      <div className="evaluation-note"><div className="notebook-mark"><FileText size={18} /></div><div><strong>This is the part you can defend in a review.</strong><p>Instead of saying “the AI is accurate,” this page shows the labelled questions, retrieval baselines, rules, and failure cases used in the prototype.</p></div><span className="mono-label">EXPERIMENT / 04</span></div>
      <div className="eval-summary-grid">{[[String(evaluationSummary.questions), "labelled questions"], [String(evaluationSummary.sourceDocs), "source documents"], [String(evaluationSummary.labelledPairs), "query / passage pairs"], [evaluationSummary.lastRun, "last run"]].map(([value, label], index) => <div className="eval-summary" key={label}><strong className={index === 3 ? "eval-date" : ""}>{value}</strong><span>{label}</span></div>)}</div>
      <div className="content-card eval-card"><div className="content-card-heading"><div><SectionEyebrow icon={BarChart3}>RETRIEVAL BENCHMARK</SectionEyebrow><h2>Does reranking actually help?</h2></div><span className="eval-caption">Recall@5 on internal labelled set</span></div><div className="benchmark-list">{retrievalBenchmarks.map((benchmark, index) => <div className="benchmark-row" key={benchmark.method}><div className="benchmark-label"><strong>{benchmark.method}</strong><span>{benchmark.note}</span></div><div className="benchmark-track"><span style={{ width: `${benchmark.recall}%` }} className={index === retrievalBenchmarks.length - 1 ? "benchmark-best" : ""} /></div><b>{benchmark.recall}%</b><small>MRR {benchmark.mrr}</small></div>)}</div><div className="eval-footnote"><span><i className="legend-dot teal-dot" />Hybrid search finds more relevant passages</span><span><i className="legend-dot rust-dot" />Reranker improves ordering</span><button className="text-button" onClick={() => onNotice("The benchmark is seeded with 48 labelled questions and is ready to replace with a real evaluation set.")}>Edit test set <ChevronRight size={14} /></button></div></div>
      <div className="eval-columns"><div className="content-card eval-card"><div className="content-card-heading"><div><SectionEyebrow icon={Zap}>EXPLICIT RULEBOOK</SectionEyebrow><h2>Rules an operator can inspect</h2></div><button className="icon-button subtle" onClick={() => onNotice("Rule editing is the next backend step.")}><Plus size={16} /></button></div><div className="rule-list">{rulebook.map(rule => <div className="rule-row" key={rule.id}><span className="rule-id">{rule.id}</span><div><strong>{rule.name}</strong><code>{rule.logic}</code></div><span className="rule-result">{rule.result}</span></div>)}</div></div><div className="content-card eval-card limitation-card"><SectionEyebrow icon={TriangleAlert}>KNOWN LIMITATIONS</SectionEyebrow><h2>What this prototype does not pretend to solve.</h2><div className="limitation-list">{knownLimitations.map(item => <div key={item}><span>—</span><p>{item}</p></div>)}</div><button className="text-button" onClick={() => onNotice("These limitation notes are saved as part of the project’s review trail.")}>Add review note <ChevronRight size={14} /></button></div></div>
      <div className="content-card review-card"><div><SectionEyebrow icon={UserRound}>HUMAN REVIEW LOOP</SectionEyebrow><h2>AI flags it. An owner decides it.</h2><p>Every finding stays provisional until a finance or procurement owner confirms the applicable policy version and closes the corrective action.</p></div><div className="review-stats"><span><strong>03</strong>pending review</span><span><strong>01</strong>human override</span><span><strong>100%</strong>source linked</span></div><Button onClick={() => onNotice("Review queue opened. Assignments will be persisted when database workflows are connected.")}><ClipboardCheck size={15} />Open review queue</Button></div>
    </section>
  );
}

function Overview({ kpis, activeFilter, setActiveFilter, onSelectFinding, onJump }: { kpis: ReturnType<typeof getKpis>; activeFilter: FilterValue; setActiveFilter: (filter: FilterValue) => void; onSelectFinding: (finding: Finding) => void; onJump: (section: Section) => void }) {
  const visibleFindings = findings.filter(item => activeFilter === "all" || item.severity === activeFilter);
  return (
    <>
      <section className="hero-grid">
        <div className="hero-panel">
          <div className="hero-panel-top"><SectionEyebrow icon={Radar}>PROCUREMENT REVIEW</SectionEyebrow><span className="live-pill"><span />Demo workspace</span></div>
          <h1>See where policy<br /><em>breaks in practice.</em></h1>
          <p>This sample compares a procurement rule with the records around it. It contains 17 source documents, 48 labelled questions, and three repeatable control gaps.</p>
          <div className="hero-actions"><Button onClick={() => onJump("findings")}><ShieldAlert size={15} />Inspect 3 findings</Button><Button variant="outline" onClick={() => onJump("evidence")}><Upload size={15} />Add evidence</Button></div>
          <div className="hero-footnote"><span className="mono-label">DATASET</span><span>Northstar sample / v0.1</span><span className="hero-separator" /><span className="mono-label">SOURCES</span><span>{kpis.evidence} monitored</span></div>
        </div>
        <div className="health-panel">
          <div className="panel-heading"><span className="mono-label">PROCESS HEALTH</span><button className="icon-button subtle"><MoreHorizontal size={17} /></button></div>
          <div className="health-ring" style={{ "--score": `${kpis.health * 3.6}deg` } as React.CSSProperties}><div><strong>{kpis.health}</strong><span>/ 100</span></div></div>
          <div className="health-copy"><strong>Needs attention</strong><p>Up 6 points since last review</p></div>
          <div className="health-bars"><span>Vendor onboarding <b>62%</b></span><div><i style={{ width: "62%" }} /></div><span>Purchase approvals <b>78%</b></span><div><i style={{ width: "78%" }} /></div><span>Invoice controls <b>86%</b></span><div><i style={{ width: "86%" }} /></div></div>
        </div>
      </section>
      <section className="metric-grid"><MetricCard label="Open drift findings" value={String(kpis.openFindings).padStart(2, "0")} detail="2 high-risk patterns" tone="rust" icon={ShieldAlert} /><MetricCard label="Avoidable rework" value={`${kpis.rework.toFixed(1)}h`} detail="↓ 12% vs last week" trend="down" tone="amber" icon={Clock3} /><MetricCard label="Evidence monitored" value={String(kpis.evidence).padStart(2, "0")} detail="4 data types connected" tone="teal" icon={FolderOpen} /><MetricCard label="Recovered this month" value={String(kpis.resolved).padStart(2, "0")} detail="actions closed" trend="up" icon={Check} /></section>
      <section className="content-grid overview-content">
        <div className="content-card signal-card"><div className="content-card-heading"><div><SectionEyebrow icon={Activity}>SIGNAL PULSE</SectionEyebrow><h2>Drift is clustering around handoffs</h2></div><span className="card-note">Last 30 days</span></div><div className="pulse-layout"><div className="pulse-number"><strong>18</strong><span>repeat exceptions</span><small><ArrowUpRight size={13} /> 24% vs prior period</small></div><div className="pulse-chart"><MiniBars /><div className="chart-axis"><span>Sep 19</span><span>Oct 04</span><span>Oct 18</span></div></div></div><div className="signal-footer"><span><i className="legend-dot rust-dot" />Policy bypasses <b>11</b></span><span><i className="legend-dot teal-dot" />Missing evidence <b>05</b></span><span><i className="legend-dot amber-dot" />Slow handoffs <b>02</b></span></div></div>
        <div className="content-card change-card"><div className="content-card-heading"><div><SectionEyebrow icon={GitCompareArrows}>CHANGE MONITOR</SectionEyebrow><h2>One update needs follow-through</h2></div><button className="text-button" onClick={() => onJump("monitoring")}>View monitor <ChevronRight size={14} /></button></div><div className="change-rule"><div><span className="mono-label">PURCHASE THRESHOLD</span><div className="threshold"><strong>{changeWatch.previous}</strong><ArrowUpRight size={17} /><strong className="threshold-new">{changeWatch.current}</strong></div></div><span className="effective-chip">Effective {changeWatch.effective}</span></div><p>{changeWatch.note}</p><div className="change-foot"><span><AlertCircle size={14} />14 open requests affected</span><button className="text-button" onClick={() => onJump("monitoring")}>Review impact <ChevronRight size={14} /></button></div></div>
      </section>
      <section className="content-card findings-card"><div className="content-card-heading findings-heading"><div><SectionEyebrow icon={ShieldAlert}>RANKED FINDINGS</SectionEyebrow><h2>Where reality is diverging</h2></div><div className="filter-tabs"><button className={activeFilter === "all" ? "active" : ""} onClick={() => setActiveFilter("all")}>All <span>03</span></button><button className={activeFilter === "critical" ? "active" : ""} onClick={() => setActiveFilter("critical")}>Critical <span>01</span></button><button className={activeFilter === "high" ? "active" : ""} onClick={() => setActiveFilter("high")}>High <span>01</span></button></div></div><div className="finding-list">{visibleFindings.map(finding => <FindingRow key={finding.id} finding={finding} onSelect={onSelectFinding} />)}</div><button className="full-list-button" onClick={() => onJump("findings")}>Open all findings <ChevronRight size={15} /></button></section>
    </>
  );
}

function ThemeModeControl() {
  const { theme, setTheme } = useTheme();
  const modes: Array<{ id: Theme; label: string; icon: typeof Sun }> = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dim", label: "Dim", icon: Monitor },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];
  return <div className="theme-mode-control" aria-label="Choose display mode">{modes.map(({ id, label, icon: Icon }) => <button key={id} className={theme === id ? "active" : ""} onClick={() => setTheme(id)} title={`${label} mode`} aria-label={`${label} mode`}><Icon size={14} /><span>{label}</span></button>)}</div>;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [actions, setActions] = useState<CorrectiveAction[]>(initialActions);
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>(seededEvidence);
  const [uploading, setUploading] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageMode>("English");
  const fileInput = useRef<HTMLInputElement>(null);
  const kpis = useMemo(() => getKpis(actions), [actions]);

  useEffect(() => { document.title = "OpsDrift AI — Process observability"; }, []);
  useEffect(() => { if (!notice) return; const timeout = window.setTimeout(() => setNotice(null), 3600); return () => window.clearTimeout(timeout); }, [notice]);

  const jumpTo = (section: Section) => { setActiveSection(section); setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const completeAction = (id: string) => { setActions(current => current.map(action => action.id === id ? { ...action, status: "complete", progress: 100 } : action)); setNotice("Action marked complete. Process health recalculated."); };
  const createAction = (finding: Finding) => { const exists = actions.some(action => action.findingId === finding.id && action.status !== "complete"); if (exists) { setNotice("An open corrective action already exists for this finding."); return; } setActions(current => [{ id: `action-${Date.now()}`, findingId: finding.id, title: finding.action.split(",")[0], owner: "Unassigned", dueDate: "Oct 30", status: "in progress", impact: finding.impact, progress: 0 }, ...current]); setNotice("Corrective action created and added to the queue."); };
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setUploading(true); const item = await parseUpload(file); setEvidenceItems(current => [item, ...current]); setUploading(false); setNotice(`${file.name} added to evidence library.`); event.target.value = ""; };
  const selectFindingById = (findingId: string) => { const finding = findings.find(item => item.id === findingId); if (finding) { setSelectedFinding(finding); setActiveSection("findings"); } };

  const sectionTitle: Record<Section, { eyebrow: string; title: string; copy: string }> = {
    overview: { eyebrow: "Operations overview", title: "Procurement control center.", copy: "A clear view of where documented policy and day-to-day records stop agreeing." },
    findings: { eyebrow: "Drift findings", title: "Where reality is diverging.", copy: "Ranked by risk, recurrence, and the cost of leaving the gap untouched." },
    actions: { eyebrow: "Corrective actions", title: "Move findings toward closure.", copy: "Every detected gap becomes an owned next step with an audit trail." },
    evidence: { eyebrow: "Evidence library", title: "The sources behind every signal.", copy: "Policies define the expected process. Records show what happened." },
    monitoring: { eyebrow: "Change monitor", title: "Policy changes need operational follow-through.", copy: "Track where a new version should change forms, handoffs, and open work." },
    india: { eyebrow: "India controls", title: "Compliance signals before money moves.", copy: "GST, TDS, vendor risk, and invoice controls built around Indian procurement workflows." },
    evaluation: { eyebrow: "Evaluation lab", title: "Show the work behind the answer.", copy: "Baselines, labelled examples, explicit rules, and limitations for a reproducible project review." },
  };

  return (
    <div className="ops-app">
      <aside className={`app-sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup"><div className="brand-mark"><span /></div><div><strong>opsdrift</strong><small>operations intelligence</small></div></div>
        <div className="workspace-switcher"><div className="workspace-avatar">N</div><div><span>Northstar Manufacturing India</span><small>Procurement workspace</small></div><ChevronRight size={15} /></div>
        <nav className="primary-nav"><span className="nav-label">Workspace</span>{navItems.map(item => <button key={item.id} className={activeSection === item.id ? "active" : ""} onClick={() => jumpTo(item.id)}><item.icon size={17} /><span>{item.label}</span>{item.count && <b>{item.count}</b>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="coverage-card"><div className="coverage-top"><span>Coverage</span><strong>78%</strong></div><div className="coverage-track"><span /></div><p>3 of 4 procurement flows monitored</p></div><button className="sidebar-link"><UserRound size={16} />Workspace settings</button><button className="sidebar-link"><CircleHelp size={16} />How OpsDrift works</button><div className="user-row"><div className="user-avatar">AK</div><div><strong>Arjun Kapoor</strong><span>Workspace admin</span></div><MoreHorizontal size={17} /></div></div>
      </aside>
      {mobileNavOpen && <button className="mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}
      <main className="app-main">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>Northstar Manufacturing India</span><ChevronRight size={14} /><strong>{sectionTitle[activeSection].eyebrow}</strong></div><div className="topbar-actions"><ThemeModeControl /><button className="search-trigger"><Search size={16} /><span>Search workspace</span><kbd>⌘ K</kbd></button><button className="icon-button"><BellIcon /></button><div className="topbar-avatar">AK</div></div></header>
        <div className="page-content">
          <div className="page-header"><div><SectionEyebrow icon={activeSection === "overview" ? Radar : navItems.find(item => item.id === activeSection)?.icon}>{sectionTitle[activeSection].eyebrow}</SectionEyebrow><h2>{sectionTitle[activeSection].title}</h2><p>{sectionTitle[activeSection].copy}</p></div><div className="page-header-actions"><span className="date-chip"><Clock3 size={14} />Oct 01 — Oct 18, 2026</span><button className="icon-button subtle"><Filter size={16} /></button></div></div>
          {activeSection === "overview" && <Overview kpis={kpis} activeFilter={activeFilter} setActiveFilter={setActiveFilter} onSelectFinding={setSelectedFinding} onJump={jumpTo} />}
          {activeSection === "findings" && <section className="content-card page-card"><div className="content-card-heading findings-heading"><div><SectionEyebrow icon={ShieldAlert}>ALL SIGNALS</SectionEyebrow><h2>Ranked by business impact</h2></div><div className="filter-tabs"><button className={activeFilter === "all" ? "active" : ""} onClick={() => setActiveFilter("all")}>All <span>03</span></button><button className={activeFilter === "critical" ? "active" : ""} onClick={() => setActiveFilter("critical")}>Critical <span>01</span></button><button className={activeFilter === "high" ? "active" : ""} onClick={() => setActiveFilter("high")}>High <span>01</span></button></div></div><div className="finding-list">{findings.filter(item => activeFilter === "all" || item.severity === activeFilter).map(finding => <FindingRow key={finding.id} finding={finding} onSelect={setSelectedFinding} />)}</div></section>}
          {activeSection === "actions" && <section className="content-card page-card"><div className="content-card-heading"><div><SectionEyebrow icon={ClipboardCheck}>ACTION QUEUE</SectionEyebrow><h2>{actions.filter(action => action.status !== "complete").length} actions need an owner’s attention</h2></div><Button onClick={() => setNotice("New actions are created from a finding so every task keeps its evidence context.")}><Plus size={15} />New action</Button></div><div className="action-list">{actions.map(action => <ActionRow key={action.id} action={action} onComplete={completeAction} onSelectFinding={selectFindingById} />)}</div></section>}
          {activeSection === "evidence" && <section className="content-card page-card"><div className="content-card-heading"><div><SectionEyebrow icon={FolderOpen}>MONITORED EVIDENCE</SectionEyebrow><h2>{evidenceItems.length} sources in this workspace</h2></div><div><input ref={fileInput} type="file" accept=".txt,.csv,.json,.md,.log" hidden onChange={handleUpload} /><Button onClick={() => fileInput.current?.click()} disabled={uploading}><Upload size={15} />{uploading ? "Reading file…" : "Add evidence"}</Button></div></div><div className="upload-callout"><div className="upload-icon"><Sparkles size={19} /></div><div><strong>Bring in the evidence your business already has.</strong><p>Upload a policy, CSV export, invoice note, or approval log. The MVP reads text locally and adds it to the evidence chain without sending files anywhere.</p></div><span className="mono-label">LOCAL ANALYSIS</span></div><div className="evidence-list">{evidenceItems.map(item => <EvidenceCard key={item.id} item={item} />)}</div></section>}
          {activeSection === "monitoring" && <section className="monitoring-layout"><div className="content-card page-card change-detail-card"><div className="content-card-heading"><div><SectionEyebrow icon={GitCompareArrows}>POLICY DIFF</SectionEyebrow><h2>{changeWatch.title}</h2></div><StatusPill status="watching" /></div><div className="version-compare"><div><span className="mono-label">PREVIOUS VERSION</span><strong>{changeWatch.previous}</strong><small>Purchase Approval Matrix v2.3</small></div><div className="compare-arrow"><ArrowUpRight size={20} /></div><div className="current-version"><span className="mono-label">CURRENT VERSION</span><strong>{changeWatch.current}</strong><small>Purchase Approval Matrix v2.4</small></div></div><div className="change-explanation"><SectionEyebrow icon={AlertCircle}>Operational impact</SectionEyebrow><p>{changeWatch.note}</p><div className="impact-grid"><div><strong>03</strong><span>process steps to update</span></div><div><strong>14</strong><span>open requests affected</span></div><div><strong>02</strong><span>teams to notify</span></div></div></div><Button onClick={() => setNotice("Impact review queued for Finance and Procurement.")}><ClipboardCheck size={15} />Create impact review</Button></div><div className="content-card page-card monitor-side"><SectionEyebrow icon={Zap}>WHAT OPSDRIFT WATCHES</SectionEyebrow><h2>Changes are only useful when the work changes too.</h2><p>OpsDrift maps policy changes to the forms, roles, and open records that depend on them. That is the gap between version control and operational control.</p><div className="watch-list"><span><Check size={14} />Approved policy versions</span><span><Check size={14} />Forms and checklists</span><span><Check size={14} />Open requests and exceptions</span><span><Check size={14} />Owners and due dates</span></div><button className="text-button" onClick={() => setNotice("Monitoring rules are available in the next workspace setup step.")}>Configure monitoring <ChevronRight size={14} /></button></div></section>}
          {activeSection === "india" && <IndiaControls language={language} setLanguage={setLanguage} onNotice={setNotice} />}
          {activeSection === "evaluation" && <EvaluationLab onNotice={setNotice} />}
        </div>
      </main>
      {selectedFinding && <FindingDrawer finding={selectedFinding} evidenceItems={evidenceItems} onClose={() => setSelectedFinding(null)} onCreateAction={createAction} />}
      {notice && <div className="toast-message"><Check size={16} /><span>{notice}</span><button onClick={() => setNotice(null)}><X size={14} /></button></div>}
    </div>
  );
}

function BellIcon() {
  return <span className="bell-icon"><Activity size={17} /><i /></span>;
}
