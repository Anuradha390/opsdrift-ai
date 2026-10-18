# OpsDrift AI MVP TODO

## Dashboard communicates procurement-process drift

- [ ] Show a persistent OpsDrift AI navigation rail and a main operations canvas.
- [ ] Show a clear product promise explaining that the app compares official policy with observed business evidence.
- [ ] Show health score, monitored evidence count, open findings, estimated rework, and current process focus.
- [ ] Show a ranked findings list with severity, process, title, evidence count, impact, and status.
- [ ] Provide filters for all findings, high risk, and process areas.

## Findings expose evidence and the retrieval path

- [ ] When a finding is selected, open a detail view containing the requirement, observed reality, risk, root-cause hypothesis, recommended action, and citations.
- [ ] Show source names, source type, page/record references, version, effective date, and excerpts.
- [ ] Show the hybrid retrieval trail with keyword match, semantic match, metadata filter, and reranking score.
- [ ] Use plain business language ahead of ML jargon while retaining technical retrieval details for credibility.

## Corrective actions are actionable and stateful

- [ ] Show current corrective actions with owner, due date, status, and impact estimate.
- [ ] Allow an action to be marked complete from the UI.
- [ ] Update the action status and health/recovery presentation without losing the finding context.
- [ ] Let the user create a corrective action from an open finding.

## Evidence library and lightweight ingestion

- [ ] Show seeded evidence records for policies, invoices, vendor records, and approval emails.
- [ ] Let the user upload local text, CSV, or JSON files through the browser.
- [ ] Add uploaded files to the evidence library and show the resulting source metadata.
- [ ] Explain that the MVP uses deterministic local analysis and that real embeddings/vector storage can be connected later.

## Change monitoring and product positioning

- [ ] Show a change-monitoring view with the latest policy version, affected process, changed rule, and recommended follow-up.
- [ ] Show a compact “Why OpsDrift?” panel that differentiates process observability from generic document chat.
- [ ] Make the interface responsive enough to use on narrower screens.

## Delivery checks

- [ ] Serve the complete route manifest at `/manus-routes.json`.
- [ ] Pass `pnpm check`.
- [ ] Pass the production build.
- [ ] Start the configured Preview server and verify `/api/health` and `/manus-routes.json`.
- [ ] Save the finished implementation to the managed project checkpoint.
