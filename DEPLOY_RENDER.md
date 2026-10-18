# Deploy OpsDrift AI from GitHub to Render

The repository is configured as a Docker web service. Render reads `render.yaml`, builds `Dockerfile`, starts `node dist/index.js`, and checks `/api/health`.

## GitHub

This project should be kept in a private GitHub repository. The source excludes `.env` files, build output, local logs, and database files.

## Render

1. Open the Render dashboard and choose **New → Blueprint**.
2. Select the `opsdrift-ai` GitHub repository.
3. Keep the service name `opsdrift-ai` and the free plan for the demo.
4. Render will use `render.yaml` and deploy the Dockerfile automatically.
5. After deployment, verify the service URL and `/api/health`.

The current MVP does not need external secrets. When real database persistence, GSTIN verification, Tally, Zoho Books, Gmail, or Outlook connectors are added, add those values in Render Environment Variables rather than committing them to GitHub.
