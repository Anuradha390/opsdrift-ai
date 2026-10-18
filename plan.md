# OpsDrift AI MVP Plan

## Product scope

OpsDrift AI is a business operations intelligence dashboard for procurement-process drift in Indian small and mid-sized businesses. It is not a generic chat-with-documents app. It compares expected process requirements from SOPs and policies with observed evidence from invoices, vendor records, and approval messages. The MVP surfaces repeated deviations, missing evidence, policy-version risk, and corrective actions using INR-denominated examples.

The first demo ships with a realistic seeded procurement workspace so the product is immediately useful on first load. It also supports local upload of text, CSV, JSON, and common office-like files through the browser; uploaded content is represented in the evidence library and analyzed with deterministic rules that mirror a hybrid retrieval/reranking pipeline. The product must clearly show the evidence chain behind a finding.

## Required product behaviors

- Show a procurement operations dashboard with a health score, active drift findings, avoidable rework, and monitored evidence.
- Let the user filter findings by severity and process.
- Let the user inspect a finding in a detail drawer with the policy requirement, observed evidence, risk, root-cause hypothesis, recommended action, and source citations.
- Show the retrieval path as a visible evidence trail: keyword match, semantic match, metadata filters, and reranking score.
- Let the user create and track corrective actions with owner, due date, status, and impact estimate.
- Let the user mark an action complete and show the resulting change in the dashboard.
- Let the user upload a local text/CSV/JSON file and add it to the monitored evidence library.
- Show a change-monitoring view that explains how a policy update could affect process steps.
- Include a small “Why OpsDrift?” positioning panel that communicates policy-vs-reality drift detection rather than generic document chat.
- Show an India controls workspace with GST/TDS exception signals, three-way PO/GRN/invoice matching, vendor risk scores, process scores, root-cause notes, ROI metrics, CSV audit export, bilingual labels, and integration-ready surfaces for Tally, Zoho Books, and email.
- Show an evaluation lab with BM25/vector/hybrid/reranker comparison, a labelled test-set summary, explicit business rules, known limitations, and a human-review loop so the project can be defended as an engineering study rather than a generic AI interface.

## Implementation approach

The initial implementation is a polished React dashboard backed by a small typed local data model. Seeded data represents policies, evidence records, findings, corrective actions, and process metrics. The analysis functions are pure TypeScript so they can later be moved behind tRPC procedures and replaced by real embeddings, BM25, vector storage, and an LLM without changing the UI contract.

Uploaded files are read in the browser. CSV/JSON/text content is summarized into an evidence record and matched against the seeded procurement requirement patterns. The MVP avoids requiring external model/API keys and therefore remains runnable in Preview. The code keeps retrieval and analysis logic isolated in `client/src/lib/opsdrift-data.ts` for later backend integration.

## Phase 1 business workflow extension

The Business toolkit workspace adds the first operator-facing workflows beyond the dashboard: import preview, a browser-local policy rule editor, searchable PO–GRN–invoice review with status transitions, explainable vendor-risk flags, a policy-threshold impact simulator, a process drift heatmap, reviewer notes, and CSV export. These are intentionally useful prototype workflows with synthetic data. Their state is saved in the browser where appropriate; database persistence, authenticated workspaces, and live ERP connectors remain separate production steps.

The visual shell now supports Light, Dim, Dark, and System display modes through a persistent theme context. The interface uses grounded labels such as “Procurement review” and “Demo workspace” instead of implying that external company systems are already connected.

## Project structure

- `client/src/pages/Home.tsx`: main dashboard shell, navigation, dashboard views, drawers, and UI state.
- `client/src/lib/opsdrift-data.ts`: typed seeded data, drift-analysis logic, upload parsing helpers, and KPI derivation.
- `client/src/index.css`: visual system and responsive dashboard styling.
- `client/public/manus-routes.json`: declared route manifest for the single-page dashboard.
- `server/_core/index.ts`: existing server entry and health route, preserved for future API/data persistence.
- `drizzle/schema.ts` and `server/db.ts`: existing managed database foundation, preserved for a later persistence pass.

## Design direction

### Style options considered

- **Editorial operations console** (0.07): a serious magazine-like dashboard with numbered findings and high-contrast data notes.
- **Industrial control room** (0.08): dark, dense, status-heavy monitoring UI with neon alert colors.
- **Civic ledger** (0.06): calm, paper-like compliance workspace with forest ink, sand backgrounds, and red exception marks.

Chosen direction: **Editorial operations console**.

### Design movement

Swiss editorial systems meets modern operations software: structured columns, strong typographic hierarchy, narrow annotations, and clear evidence labels.

### Core principles

1. Evidence before decoration: every major insight has a source, timestamp, or confidence signal.
2. Calm by default, sharp at the point of risk: warm paper surfaces keep routine operations readable while rust, amber, and teal signal exceptions and verified progress.
3. One screen, one decision: findings open into a focused evidence drawer instead of sending the user through nested pages.
4. Business language first: say “process drift,” “evidence,” “owner,” and “next action” before using ML jargon.

### Color philosophy

Use a parchment-white foundation with deep ink text, muted slate labels, and an ownable rust-red accent for drift. Teal indicates verified or recovered process health; amber marks watch items. The palette should feel like a printed operations brief brought into a live dashboard, not a generic SaaS blue template.

### Layout paradigm

A persistent left rail frames a wide editorial canvas. The main area uses asymmetric columns: a large “signal” panel, compact KPI blocks, and a ranked findings list. Detail inspection enters from the right as a document-style drawer with a vertical evidence spine.

### Signature elements

- A thin “evidence spine” line connecting findings to source excerpts.
- Monospaced micro-labels for source IDs, versions, and retrieval stages.
- Large numbered drift findings with a compact severity stamp.

### Interaction philosophy

Clicking a finding should reveal its proof, not merely more prose. Filters update visible counts. Corrective-action buttons give immediate feedback and move items into a closed state without losing audit context. Upload is intentionally lightweight and explains what the demo can analyze.

### Animation

Use subtle 160–220ms ease-out transitions for drawers, filter changes, and status updates. Avoid looping animations. The dashboard should feel deliberate and operational; only the health score and action confirmation may use a short reveal motion.

### Typography system

Use a serif display face for major titles and a neutral sans-serif for UI copy. Use monospace only for system metadata, IDs, and retrieval stages. The hierarchy is: 48px editorial headline, 18–24px section titles, 13–15px body/UI copy, 10–11px uppercase metadata.

### Brand essence

OpsDrift AI is the process observability layer for growing companies: it finds where daily work drifts from official process and tells operators what to fix next. Personality: forensic, calm, useful.

### Brand voice

Headlines should be direct and business-readable: “Your process is leaking at vendor onboarding.” CTAs should be action-oriented: “Inspect evidence” and “Create corrective action.” Avoid generic AI claims.

### Wordmark & logo

Use a compact wordmark with an offset slash through the O to represent drift from the intended path. In the app shell, render the mark as a rust square containing a white offset line, followed by `opsdrift`.

### Signature brand color

Rust red `#B94A38`, used sparingly for drift findings, the active rail marker, and evidence warnings.

## Build workflow

1. Implement the typed local product model and seeded analysis data.
2. Replace the placeholder home page with the responsive dashboard and evidence drawer.
3. Add client-side upload handling and corrective-action state changes.
4. Add route manifest and project metadata.
5. Run TypeScript checks and production build; start the Preview server and verify health plus route manifest.
6. Save the finished version to the managed project checkpoint.
