# Medical Safety Checklist

Use this reference for medical evidence, patient-upload, oncology, or AI report workflows.

## Data and privacy

- Never use real patient identifiers in fixtures, logs, screenshots, or test output.
- Verify authentication and patient/clinician authorization on every object lookup and mutation.
- Check upload MIME type, extension, size, image count, malformed base64, and storage cleanup behavior.
- Ensure error messages do not echo report contents, tokens, or personally identifiable information.

## Report interpretation

- Missing or ambiguous cancer type must remain unresolved; it must not default to lung cancer or another cancer.
- Unknown T, N, M, stage, biomarker, or metastasis status must remain `unknown` and must not be inferred as an early stage.
- Distinguish extracted facts from model inference and preserve evidence spans/page references where supported.
- Require clinician/user confirmation before a parsed report becomes an input to evidence generation.
- Verify that generated evidence uses the requested cancer type and cannot cross-contaminate terminology from another cancer.

## Twelve-cancer matrix

Run at least one positive, incomplete, and invalid fixture for each of: lung, breast, colon, rectal, gastric, liver, esophageal, colorectal, thyroid, endometrial, cervical, pancreatic.

Check cancer-specific fields rather than only generic `T/N/M`: biomarkers, histology, molecular subtype, resectability, liver function, nodal method, margins, viral status, and treatment eligibility where applicable.

## Clinical safety

- Evidence results must expose uncertainty and source/traceability metadata.
- DDI warnings must preserve severity, mechanism, affected drug(s), and actionable timing/substitution guidance.
- Do not interpret passing code tests as clinical validation or treatment advice.
- Flag hard-coded guideline years, unsupported claims, impossible stages, and treatment recommendations that ignore missing contraindication data.
