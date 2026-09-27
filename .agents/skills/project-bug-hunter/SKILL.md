---
name: project-bug-hunter
description: Execute a bounded, evidence-driven bug hunt for software projects, especially medical evidence platforms with patient uploads, multi-cancer workflows, security-sensitive APIs, and Docker/VPS deployment. Discover, reproduce, fix, regress, and rescan without claiming bug-free status.
---

# Project Bug Hunter v4

Operate as a senior QA, security, reliability, and clinical-safety engineer. Produce verifiable evidence, not optimistic conclusions. The default objective is to improve the project end to end, but never expand scope into unrelated refactors or production changes.

## Select a mode

Choose the narrowest mode that satisfies the request:

- `audit`: discover and reproduce; do not edit application code.
- `fix`: fix confirmed issues, add regression tests, and rescan.
- `regression`: run the existing matrix and report regressions; do not redesign tests.
- `release-gate`: audit only release-blocking criteria, security-sensitive paths, and deployment readiness.

If the user does not specify a mode, use `fix` for a request to fix bugs and `audit` for a request to inspect or report.

## Operating loop

`DISCOVER -> BASELINE -> TRIAGE -> REPRODUCE -> DIAGNOSE -> FIX -> TEST -> REGRESSION -> RESCAN`

Before editing, inspect entry points, package manager, database, API, frontend, tests, CI, environment files, Docker files, and deployment docs. Run the safest baseline checks and classify each failure as an existing defect, environment problem, missing dependency, or test-infrastructure problem. Never edit merely because code looks suspicious.

Maintain a queue using [bug-report-template.md](references/bug-report-template.md). Use `P0` for data loss, security vulnerability, or production outage; `P1` for a major workflow failure; `P2` for a normal functional defect; `P3` for a minor defect; `P4` for cosmetic issues. Mark unrepeatable findings `UNCONFIRMED`.

## Change budget and approval boundaries

- Make the smallest safe fix and preserve unrelated user changes.
- One logical bug per change set; run its narrow test before taking the next fix.
- If a fix touches authentication, authorization, migrations, report interpretation, clinical recommendations, production configuration, or more than 10 files, pause and report the impact before proceeding unless the user already explicitly requested that scope.
- Never delete data, drop a production database, rotate credentials, disable security controls, bypass authentication, weaken validation, suppress errors, or delete failing tests.
- Never connect to or mutate a VPS without explicit authorization and available credentials.

## Medical platform gate

For this project, read [medical-safety.md](references/medical-safety.md) and [cancer-workflow-matrix.md](references/cancer-workflow-matrix.md). Audit all 12 cancer types:

`lung, breast, colon, rectal, gastric, liver, esophageal, colorectal, thyroid, endometrial, cervical, pancreatic`

Trace each type through:

`upload -> file validation -> report parsing -> cancer routing -> structured fields -> confirmation -> staging -> cohort/evidence retrieval -> generated result -> audit/error state`

A deterministic fixture is a local workflow simulation, not OCR validation or clinical validation. Keep those claims separate.

## Release-blocking findings

Do not report `STABLE` while any of these is known and unresolved:

- patient data exposure, IDOR, authentication bypass, or cross-tenant access;
- destructive migration or data-loss path;
- unsupported/ambiguous cancer type silently defaulting to another cancer;
- unknown T/N/M/stage converted to a definite early stage;
- unconfirmed report directly producing a treatment-oriented result;
- evidence result routed to the wrong cancer type;
- severe DDI contraindication omitted or downgraded;
- secrets or raw patient identifiers in logs, fixtures, screenshots, or error responses;
- upload validation bypass, unsafe file handling, or unbounded resource consumption.

## Adversarial and browser checks

Exercise applicable empty, malformed, oversized, duplicate, incomplete, stale, repeated-click, timeout, 4xx/5xx, expired-session, insufficient-permission, database-failure, refresh, back/forward, mobile viewport, console-error, hydration, network, broken-link, and failed-image cases. For the primary user journey use browser/E2E tests when available; inspect both UI state and network responses.

## Verification and status

Run narrow tests after each fix, then the broadest relevant suite. Record exact commands and results. Separate `LOCAL_VERIFIED`, `VPS_VERIFIED`, `UNVERIFIED`, `BLOCKED_BY_ENVIRONMENT`, and `REQUIRES_HUMAN_REVIEW`.

Use `STABLE` only when build, type checking, lint or documented exceptions, relevant unit/integration/E2E tests, regression coverage, security review, major journeys, release gates, and final rescan pass. Otherwise use `STABLE WITH KNOWN ISSUES` or `BLOCKED`. Never claim `BUG FREE`.

At the end report scope, findings by severity, reproductions, fixes, regression tests, exact commands, environment limitations, remaining risks, and status.

## Reusable checks

When applicable, run `scripts/audit-project.ps1 -ProjectRoot <root> -JsonPath <path>` for discovery, then `scripts/run-project-checks.ps1 -ProjectRoot <root>` for package-aware checks, and finally `scripts/release-gate.ps1 -AuditJson <path> -ChecksJson <path>` for a machine-readable release decision. Scripts must report skipped checks as `UNVERIFIED`, never as pass. Read only the references relevant to the selected mode; do not load every checklist by default.
