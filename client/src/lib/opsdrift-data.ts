export type Severity = "critical" | "high" | "medium" | "low";
export type FindingStatus = "open" | "watching" | "resolved";
export type ActionStatus = "in progress" | "blocked" | "complete";

export type Evidence = {
  id: string;
  name: string;
  type: "policy" | "invoice" | "vendor record" | "approval email" | "spreadsheet" | "upload";
  version: string;
  date: string;
  owner: string;
  excerpt: string;
  tags: string[];
  page?: string;
};

export type RetrievalStage = {
  label: string;
  detail: string;
  score: string;
  tone: "rust" | "teal" | "ink" | "amber";
};

export type Finding = {
  id: string;
  index: string;
  severity: Severity;
  process: string;
  title: string;
  summary: string;
  requirement: string;
  reality: string;
  risk: string;
  rootCause: string;
  action: string;
  impact: string;
  status: FindingStatus;
  evidenceIds: string[];
  citations: { evidenceId: string; label: string; excerpt: string }[];
  retrieval: RetrievalStage[];
  detected: string;
};

export type CorrectiveAction = {
  id: string;
  findingId: string;
  title: string;
  owner: string;
  dueDate: string;
  status: ActionStatus;
  impact: string;
  progress: number;
};

export const evidence: Evidence[] = [
  {
    id: "ev-policy-01",
    name: "Procurement SOP",
    type: "policy",
    version: "v3.2",
    date: "Sep 08, 2026",
    owner: "Procurement",
    page: "§4.1 · p. 12",
    excerpt: "All new vendors must complete the cybersecurity questionnaire before a purchase order or system access is issued.",
    tags: ["vendor onboarding", "security", "required"],
  },
  {
    id: "ev-policy-02",
    name: "Purchase Approval Matrix",
    type: "policy",
    version: "v2.4",
    date: "Aug 24, 2026",
    owner: "Finance",
    page: "§3.1 · p. 5",
    excerpt: "Purchases above ₹5,00,000 require three comparable quotations and Finance Manager approval before commitment.",
    tags: ["purchasing", "threshold", "approval"],
  },
  {
    id: "ev-policy-03",
    name: "Accounts Payable Control Standard",
    type: "policy",
    version: "v1.8",
    date: "Jul 29, 2026",
    owner: "Finance",
    page: "§2.2 · p. 4",
    excerpt: "Invoice approvals must be captured in the approval system. Email approval may be attached as evidence but cannot be the sole approval record.",
    tags: ["invoice", "approval", "audit"],
  },
  {
    id: "ev-vendor-01",
    name: "Vendor onboarding export",
    type: "vendor record",
    version: "weekly",
    date: "Oct 16, 2026",
    owner: "Procurement Ops",
    page: "Rows 44–61",
    excerpt: "18 of 29 vendors activated in the last 30 days have no cybersecurity questionnaire attached. 11 were activated by the same operator.",
    tags: ["vendor onboarding", "exception", "repeated"],
  },
  {
    id: "ev-invoice-01",
    name: "Q3 purchase requests",
    type: "spreadsheet",
    version: "export",
    date: "Oct 15, 2026",
    owner: "Finance Ops",
    page: "Rows 204–228",
    excerpt: "7 purchase requests above ₹5,00,000 contain only one supplier quote. Median approval lag is 9.2 days for these requests.",
    tags: ["purchasing", "quotes", "delay"],
  },
  {
    id: "ev-email-01",
    name: "Invoice approval mailbox",
    type: "approval email",
    version: "30-day sample",
    date: "Oct 14, 2026",
    owner: "AP Operations",
    page: "Thread 701–739",
    excerpt: "41% of approvals for invoices over ₹1,00,000 are recorded only as an email reply. 12 threads do not include the invoice record.",
    tags: ["invoice", "email", "control gap"],
  },
  {
    id: "ev-policy-04",
    name: "Procurement SOP",
    type: "policy",
    version: "v3.1",
    date: "May 12, 2026",
    owner: "Procurement",
    page: "§4.1 · p. 12",
    excerpt: "Vendor security questionnaire is required before the vendor is activated in the purchasing system.",
    tags: ["vendor onboarding", "outdated"],
  },
];

export const findings: Finding[] = [
  {
    id: "finding-001",
    index: "01",
    severity: "critical",
    process: "Vendor onboarding",
    title: "Vendors are activated before security review",
    summary: "The onboarding gate is being skipped in a repeatable pattern, not as a one-off exception.",
    requirement: "Every new vendor must have a completed cybersecurity questionnaire before activation or purchase-order access.",
    reality: "18 of 29 vendors activated in the last 30 days have no questionnaire attached. 11 were activated by the same operator.",
    risk: "Unreviewed vendors can receive purchase orders and system access, creating a preventable supplier-security exposure.",
    rootCause: "The questionnaire is tracked as an optional attachment in the onboarding form, so the workflow can be completed without it.",
    action: "Make the questionnaire a blocking field, backfill the 18 affected vendor records, and route the operator pattern to Procurement Ops.",
    impact: "₹35 lakh estimated exposure avoided",
    status: "open",
    evidenceIds: ["ev-policy-01", "ev-vendor-01", "ev-policy-04"],
    citations: [
      { evidenceId: "ev-policy-01", label: "Procurement SOP v3.2 · §4.1", excerpt: "All new vendors must complete the cybersecurity questionnaire before a purchase order or system access is issued." },
      { evidenceId: "ev-vendor-01", label: "Vendor onboarding export · Rows 44–61", excerpt: "18 of 29 vendors activated in the last 30 days have no cybersecurity questionnaire attached." },
    ],
    retrieval: [
      { label: "Keyword match", detail: "questionnaire · activated · vendor", score: "0.94", tone: "rust" },
      { label: "Semantic match", detail: "security review before vendor access", score: "0.91", tone: "teal" },
      { label: "Metadata filter", detail: "Procurement · last 30 days · approved", score: "29 records", tone: "ink" },
      { label: "Cross-encoder rerank", detail: "Policy ↔ onboarding records", score: "0.97", tone: "amber" },
    ],
    detected: "12 min ago",
  },
  {
    id: "finding-002",
    index: "02",
    severity: "high",
    process: "Purchase approvals",
    title: "Large purchases are missing competitive quotes",
    summary: "The ₹5 lakh approval threshold is visible in policy but absent from a meaningful share of requests.",
    requirement: "Purchases above ₹5,00,000 require three comparable quotations and Finance Manager approval before commitment.",
    reality: "7 of 21 purchase requests above ₹5,00,000 contain only one supplier quote. These requests take 9.2 days longer to clear.",
    risk: "Single-source buying reduces price leverage and creates an audit exception with a measurable delay cost.",
    rootCause: "The purchase request template has no conditional quote checklist for the ₹5 lakh threshold.",
    action: "Add a conditional checklist to the purchase request form and notify requesters when a second and third quote is missing.",
    impact: "₹15.5 lakh avoidable delay cost",
    status: "open",
    evidenceIds: ["ev-policy-02", "ev-invoice-01"],
    citations: [
      { evidenceId: "ev-policy-02", label: "Purchase Approval Matrix v2.4 · §3.1", excerpt: "Purchases above ₹5,00,000 require three comparable quotations and Finance Manager approval before commitment." },
      { evidenceId: "ev-invoice-01", label: "Q3 purchase requests · Rows 204–228", excerpt: "7 purchase requests above ₹5,00,000 contain only one supplier quote." },
    ],
    retrieval: [
      { label: "Keyword match", detail: "above ₹5 lakh · quotations", score: "0.89", tone: "rust" },
      { label: "Semantic match", detail: "competitive bid requirement", score: "0.86", tone: "teal" },
      { label: "Metadata filter", detail: "Finance · Q3 · purchase requests", score: "21 records", tone: "ink" },
      { label: "Cross-encoder rerank", detail: "Threshold ↔ request evidence", score: "0.93", tone: "amber" },
    ],
    detected: "47 min ago",
  },
  {
    id: "finding-003",
    index: "03",
    severity: "medium",
    process: "Invoice approvals",
    title: "Approvals are happening outside the system",
    summary: "Email is being used as the real approval channel, while the system is treated as a filing cabinet.",
    requirement: "Approval decisions must be captured in the approval system. Email can be attached, but not used alone.",
    reality: "41% of approvals for invoices over ₹1,00,000 appear only in email. 12 threads do not include the invoice record.",
    risk: "Audit evidence is fragmented and AP has to reconstruct approval context manually during close and review.",
    rootCause: "Approvers can reply by email without a deep link that writes the decision back to the approval record.",
    action: "Add an approval link to notification emails and backfill the 12 orphaned approval threads before month close.",
    impact: "6.4 hrs / week rework",
    status: "watching",
    evidenceIds: ["ev-policy-03", "ev-email-01"],
    citations: [
      { evidenceId: "ev-policy-03", label: "AP Control Standard v1.8 · §2.2", excerpt: "Email approval may be attached as evidence but cannot be the sole approval record." },
      { evidenceId: "ev-email-01", label: "Invoice approval mailbox · Thread 701–739", excerpt: "41% of approvals for invoices over ₹1,00,000 are recorded only as an email reply." },
    ],
    retrieval: [
      { label: "Keyword match", detail: "email approval · sole record", score: "0.92", tone: "rust" },
      { label: "Semantic match", detail: "approval evidence fragmentation", score: "0.88", tone: "teal" },
      { label: "Metadata filter", detail: "AP · invoices over ₹1 lakh", score: "39 threads", tone: "ink" },
      { label: "Cross-encoder rerank", detail: "Control ↔ mailbox evidence", score: "0.90", tone: "amber" },
    ],
    detected: "2 hrs ago",
  },
];

export const initialActions: CorrectiveAction[] = [
  { id: "action-001", findingId: "finding-001", title: "Make cybersecurity questionnaire blocking", owner: "Maya Chen", dueDate: "Oct 21", status: "in progress", impact: "Close 18 vendor gaps", progress: 64 },
  { id: "action-002", findingId: "finding-002", title: "Add conditional quote checklist", owner: "Jon Bell", dueDate: "Oct 24", status: "blocked", impact: "Prevent 7 repeat exceptions", progress: 28 },
  { id: "action-003", findingId: "finding-003", title: "Backfill orphaned email approvals", owner: "Rita Shah", dueDate: "Oct 18", status: "in progress", impact: "Recover 12 audit records", progress: 76 },
  { id: "action-004", findingId: "finding-001", title: "Review repeat operator pattern", owner: "Procurement Ops", dueDate: "Oct 28", status: "complete", impact: "Remove systemic bypass", progress: 100 },
];

export const changeWatch = {
  title: "Purchase approval threshold changed",
  source: "Purchase Approval Matrix",
  previous: "₹2,50,000",
  current: "₹5,00,000",
  effective: "Sep 01, 2026",
  affected: "3 process steps · Finance · 14 open requests",
  note: "OpsDrift found the new threshold in the approved policy, but the purchase request form still shows the old checklist on 14 open requests.",
};

export function getEvidence(evidenceId: string) {
  return evidence.find(item => item.id === evidenceId);
}

export function getFinding(findingId: string) {
  return findings.find(item => item.id === findingId);
}

export function getKpis(actions: CorrectiveAction[]) {
  const resolved = actions.filter(action => action.status === "complete").length;
  return {
    health: Math.min(98, 74 + resolved * 3),
    evidence: evidence.length,
    openFindings: findings.filter(finding => finding.status !== "resolved").length,
    rework: actions.filter(action => action.status !== "complete").length * 2.4,
    resolved,
  };
}

export function parseUpload(file: File): Promise<Evidence> {
  return file.text().then(content => {
    const normalized = content.replace(/\s+/g, " ").trim();
    const excerpt = normalized.slice(0, 230) || "File uploaded without readable text; ready for manual review.";
    const type: Evidence["type"] = file.name.toLowerCase().includes("invoice")
      ? "invoice"
      : file.name.toLowerCase().includes("policy") || file.name.toLowerCase().includes("sop")
        ? "policy"
        : file.name.toLowerCase().includes("vendor")
          ? "vendor record"
          : file.name.toLowerCase().includes("approval") || file.name.toLowerCase().includes("email")
            ? "approval email"
            : "upload";
    return {
      id: `upload-${Date.now()}`,
      name: file.name,
      type,
      version: "uploaded",
      date: "Just now",
      owner: "Workspace upload",
      excerpt,
      tags: ["new evidence", file.type || "text file"],
    };
  });
}
