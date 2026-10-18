# OpsDrift AI MVP TODO

## Dashboard communicates procurement-process drift

- [x] Show a persistent OpsDrift AI navigation rail and a main operations canvas.
- [x] Show a clear product promise explaining that the app compares official policy with observed business evidence.
- [x] Show health score, monitored evidence count, open findings, estimated rework, and current process focus.
- [x] Show a ranked findings list with severity, process, title, evidence count, impact, and status.
- [x] Provide filters for all findings, high risk, and process areas.

## Findings expose evidence and the retrieval path

- [x] When a finding is selected, open a detail view containing the requirement, observed reality, risk, root-cause hypothesis, recommended action, and citations.
- [x] Show source names, source type, page/record references, version, effective date, and excerpts.
- [x] Show the hybrid retrieval trail with keyword match, semantic match, metadata filter, and reranking score.
- [x] Use plain business language ahead of ML jargon while retaining technical retrieval details for credibility.

## Corrective actions are actionable and stateful

- [x] Show current corrective actions with owner, due date, status, and impact estimate.
- [x] Allow an action to be marked complete from the UI.
- [x] Update the action status and health/recovery presentation without losing the finding context.
- [x] Let the user create a corrective action from an open finding.

## Evidence library and lightweight ingestion

- [x] Show seeded evidence records for policies, invoices, vendor records, and approval emails.
- [x] Let the user upload local text, CSV, or JSON files through the browser.
- [x] Add uploaded files to the evidence library and show the resulting source metadata.
- [x] Explain that the MVP uses deterministic local analysis and that real embeddings/vector storage can be connected later.

## Change monitoring and product positioning

- [x] Show a change-monitoring view with the latest policy version, affected process, changed rule, and recommended follow-up.
- [x] Show a compact “Why OpsDrift?” panel that differentiates process observability from generic document chat.
- [x] Make the interface responsive enough to use on narrower screens.

## Delivery checks

- [x] Serve the complete route manifest at `/manus-routes.json`.
- [x] Pass `pnpm check`.
- [x] Pass the production build.
- [x] Start the configured Preview server and verify `/api/health` and `/manus-routes.json`.
- [x] Save the finished implementation to the managed project checkpoint.

## India-focused controls workspace

- [x] Show INR-denominated GST/TDS exception signals with review and cleared states.
- [x] Show three-way matching across purchase order, goods receipt, and invoice records.
- [x] Show vendor risk scores with recurring flags and supplier categories.
- [x] Show process drift scores for procurement, finance, GST/TDS, and invoice matching.
- [x] Show a root-cause signal for missing conditional fields and form design gaps.
- [x] Show ROI metrics for risk identified, delay cost, records to repair, and audit hours saved.
- [x] Show CSV-ready import connectivity plus clearly labeled future Tally, Zoho Books, and email connector surfaces.
- [x] Provide an audit-ready CSV export with finding IDs, severity, impact, evidence count, and detection time.
- [x] Add English/Hindi labels for the India controls workspace.

## Technical evidence and human-review layer

- [x] Add an evaluation lab comparing BM25, vector, hybrid, and hybrid-plus-reranker retrieval.
- [x] Show labelled question count, source-document count, query/passage pairs, and last-run metadata.
- [x] Show explicit procurement and GST/TDS rules with human-readable logic and exception counts.
- [x] Show known limitations instead of hiding OCR, live-GSTIN, policy-conflict, and seeded-data boundaries.
- [x] Add a human-review loop that keeps findings provisional until an operator confirms them.
- [x] Replace generic marketing copy with a grounded dataset/sample explanation in the main dashboard.
