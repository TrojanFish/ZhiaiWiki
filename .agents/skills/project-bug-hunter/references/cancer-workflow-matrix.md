# Twelve-Cancer Workflow Matrix

For each row, run a positive fixture, an incomplete-report fixture, and an invalid/unsupported-input fixture. The result must preserve the requested cancer type, keep unknown clinical fields unknown, require confirmation before evidence generation, and expose evidence traceability.

| Cancer type | Minimum clinical signals | High-risk boundary |
|---|---|---|
| lung | histology, tumor size/solid component, T/N/M | unknown metastasis must not become M0 |
| breast | tumor size, nodes, ER/PR, HER2, Ki-67 | anatomy and molecular subtype must remain distinct |
| colon | T/N/M, nodes examined/positive, MSI/MMR | high-risk pathology must survive normalization |
| rectal | T/N/M, CRM, EMVI, anal distance | MRI risk features must not be dropped |
| gastric | T/N/M, histology, HER2, CLDN18.2 | biomarker routing must remain gastric-specific |
| liver | tumor burden, vascular invasion, Child-Pugh, ECOG | liver function uncertainty must remain visible |
| esophageal | T/N/M, histology, location | squamous and adenocarcinoma paths must not cross |
| colorectal | T/N/M, location, MSI/MMR, RAS/BRAF | colorectal route must not fall back to colon-only logic |
| thyroid | histology, age, T/N/M, recurrence risk | ATA risk and AJCC stage must remain separate |
| endometrial | histology, molecular subtype, myometrial invasion, nodes | POLE/MMR/p53 uncertainty must not be fabricated |
| cervical | histology, tumor size, parametria, nodes, nodal method | radiologic and pathologic suffixes must be preserved |
| pancreatic | size, nodes, distant mets, vascular involvement, resectability | resectability must not be inferred from stage alone |

Required negative checks: missing cancer type, unsupported cancer type, mismatched route/result type, missing report confirmation, missing evidence spans, invalid file MIME/size/count, and cross-cancer terminology leakage.
