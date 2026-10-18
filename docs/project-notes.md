# Project notes

## My contribution

I designed and implemented the procurement drift data model, evidence-grounded finding drawer, hybrid retrieval explanation layer, India-specific GST/TDS and three-way matching demo rules, vendor risk scoring, corrective-action flow, evaluation lab, human-review boundary, responsive React interface, Docker build, GitHub repository, and Render deployment.

## Evaluation disclaimer

The current benchmark values are based on a small synthetic labelled dataset created for this prototype. They are not production accuracy claims and should not be used to make tax, payment, or vendor decisions without human review.

## Design decision

The project shows both useful output and uncertainty. A finding is linked to source evidence, a rule, and a proposed action, but it is not treated as automatically correct. This was chosen because procurement policies can conflict, documents can be incomplete, and a live tax or ERP integration requires authentication and provider-specific validation.
