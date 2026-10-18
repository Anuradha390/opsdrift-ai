import { describe, expect, it } from "vitest";
import {
  buildAuditCsv,
  findings,
  gstChecks,
  retrievalBenchmarks,
  rulebook,
  threeWayMatches,
} from "../client/src/lib/opsdrift-data";

describe("OpsDrift project evidence model", () => {
  it("exports every finding with auditable columns", () => {
    const csv = buildAuditCsv();
    expect(csv.split("\n")[0]).toBe(
      '"Finding ID","Process","Severity","Status","Business Impact","Evidence Count","Detected"',
    );
    for (const finding of findings) {
      expect(csv).toContain(`"${finding.id}"`);
      expect(csv).toContain(`"${finding.impact}"`);
    }
  });

  it("keeps the retrieval comparison ordered from baseline to reranker", () => {
    expect(retrievalBenchmarks).toHaveLength(4);
    expect(retrievalBenchmarks[0].method).toBe("BM25 only");
    expect(retrievalBenchmarks.at(-1)?.method).toBe("Hybrid + reranker");
    expect(retrievalBenchmarks.at(-1)!.recall).toBeGreaterThan(retrievalBenchmarks[0].recall);
  });

  it("represents the India controls needed by the demo", () => {
    expect(gstChecks.some(check => check.check.includes("GSTIN"))).toBe(true);
    expect(threeWayMatches.every(match => match.po && match.receipt && match.invoice)).toBe(true);
    expect(rulebook.some(rule => rule.name === "GST state check")).toBe(true);
    expect(rulebook.some(rule => rule.logic.includes("₹5,00,000"))).toBe(true);
  });
});
