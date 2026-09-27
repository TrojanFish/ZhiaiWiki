# Docker and VPS Checklist

Use this reference when the project is deployed through Docker on a VPS.

## Local verification

- Inspect `Dockerfile`, Compose files, entrypoint scripts, health checks, ports, volumes, networks, and environment variable names.
- Run image build, container startup, health checks, database/schema validation, and the relevant application tests locally when Docker is available.
- Verify migrations are repeatable and do not silently reset or destroy data.
- Verify uploaded reports and generated artifacts use intended persistent volumes, not ephemeral container storage.
- Check restart behavior and service dependency readiness.

## Production safety

- Do not run destructive commands against a production database.
- Do not print secrets or copy production data into local fixtures.
- Verify HTTPS/proxy headers, secure cookies, CORS, upload limits, rate limits, and log redaction.
- Check that health endpoints do not expose credentials, patient data, or internal stack traces.
- Record VPS-only checks as unverified when no authorized connection is available; do not infer success from local Docker results.

## Reporting

Separate results into `local verified`, `VPS verified`, `VPS unavailable`, and `environment blocked`. Include the exact command and non-sensitive output summary for each.
