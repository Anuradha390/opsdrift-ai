# OpsDrift AI test cases

These cases use the anonymised files in `sample-data/`. They are small, readable examples for a project review; they are not production compliance advice.

## Case 1: Purchase threshold and quotations

**Input:** `PO-8831` has an amount of ₹2,48,600 in the sample, so it is below the ₹5,00,000 rule threshold. The dashboard finding uses a separate aggregate of seven requests above the threshold with only one quotation.

**Expected result:** The single PO is not flagged by `R-014`; the aggregate request evidence is flagged as a high-severity process pattern because the evidence count is seven and the policy requires three quotations.

**Human decision:** Finance confirms whether the policy version applies to the request date before opening a corrective action.

## Case 2: Three-way quantity mismatch

**Input:** Compare `PO-8831`, `GRN-7712`, and `INV-2026-1048`.

**Expected result:** The record is matched on quantity and PO identity. Change `received_quantity` from 10 to 8 in a copy of the sample to reproduce a quantity exception.

**Expected explanation:** “Invoice quantity is greater than accepted receipt quantity.”

## Case 3: GST state mismatch

**Input:** `INV-2026-1048` has vendor state Maharashtra, company state Maharashtra, and tax type IGST.

**Expected result:** Create a review signal because the same-state example should be checked for CGST + SGST treatment. The system does not claim to verify the GSTIN against a live government service.

## Case 4: Vendor onboarding gate

**Input:** `V-014` has `security_questionnaire=false`.

**Expected result:** High-risk vendor onboarding exception. The proposed action is to make the questionnaire a required blocking field and send the record to Procurement Ops for review.

## Case 5: Invoice approval evidence

**Input:** `INV-2026-1048` is above ₹1,00,000 and has `approval_channel=email_only`.

**Expected result:** Evidence-gap finding because the invoice should have a system approval record. The finding remains provisional until an AP owner confirms whether the email was an accepted exception.

## How to reproduce

1. Open the public demo.
2. Use **Operations overview** to inspect the seeded finding.
3. Open **India controls** for tax signals and three-way matching.
4. Open **Evaluation lab** for retrieval baselines and the explicit rulebook.
5. Use the local CSV upload control with a copy of one sample file.
6. Compare the resulting evidence record with the expected result above.
