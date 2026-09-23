# ConsultX Service Delivery Knowledge Engine & Infrastructure Architecture

**Document Reference**: `docs/SERVICE_DELIVERY_KNOWLEDGE_ENGINE_AND_INFRASTRUCTURE.md`  
**Author**: ConsultX (Pty) Ltd — Craig Ulyate (CA(SA))  
**Status**: Architecture Blueprint & Technical Roadmap  
**Effective Date**: 2026 Financial Year  

---

## 1. Executive Summary & Objective

As ConsultX expands from standardized statutory filings (CIPC annual returns, tax clearance PINs) to complex, multi-layered financial engagements (Independent Business Valuations, CIPC iXBRL conversion, 3-Way Financial Modelling, Fractional CFO leadership, and AI workflow automation), we require a **unified, scalable architecture** to manage:

1. **Expanding Knowledge Bases**: Codifying statutory regulations (Companies Act, Income Tax Act, IVS 2025, IFRS for SMEs), valuation multiples benchmarks, discount rate build-ups (CAPM/WACC), and tax rules.
2. **Agreed Delivery Steps (SOPs)**: Standard operating procedures with clear delineation between **Client Actions**, **System Automation**, and **Craig's CA(SA) Review Points**.
3. **Known Document Requirements & Validation**: Pre-flight validation, format checks, biometric compliance, and automated OCR extraction.
4. **Formatted Pages & Dedicated User Flows**: Domain-specific portal workspaces (e.g. `/portal/services/valuation/`, `/portal/services/cipc/`, `/portal/services/tax/`).
5. **Infrastructure Development Mapping**: Exactly where each engine lives across our Google Cloud Platform (GCP) and Next.js web ecosystem.

---

## 2. Five-Layer System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 1: Client Front-End & Formatted Service Workspaces (Next.js)      │
│  • Public Marketing & SEO (/services, /products)                       │
│  • Ask AnNa AI Advisor (/advisor, Portal Drawer)                       │
│  • Universal Onboarding Wizard (/portal/services/onboard)              │
│  • Specialized Service Workspaces (/portal/services/{slug})            │
│  • Document Vault & Magic Resume Portal (/portal/documents)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST / SSE Streaming
┌───────────────────────────────────▼────────────────────────────────────┐
│ Layer 2: ConsultX Delivery Engine & Knowledge Registry (TypeScript)    │
│  • Service Delivery Registry (src/lib/delivery-engine/)                │
│  • Service Specs (Valuation, CIPC, Tax, Bookkeeping, CFO)              │
│  • Intent Matcher & Rule Classifier (src/lib/advisor-api.ts)           │
│  • Rates & Pricing Engine (src/lib/rates-schedule.ts)                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON Payload / Presigned URLs
┌───────────────────────────────────▼────────────────────────────────────┐
│ Layer 3: Python Computational Engine & Review Workbench (Cloud Run)     │
│  • Valuation Computational Core (DCF, WACC, Sensitivity, Multiples)    │
│  • XBRL Tagging & Validation Adapter (Iris Carbon Integration)         │
│  • Statutory Connector (CIPC BizPortal / Companies API / SARS eFiling) │
│  • PDF / Document Generation Engine (WeasyPrint, ReportLab, OpenPyXL)  │
│  • Craig's CA(SA) Operator Workbench & Approval Gateways               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ IAM / OAuth / Secret References
┌───────────────────────────────────▼────────────────────────────────────┐
│ Layer 4: Secure Data Vault & Identity Management (GCP Cloud Storage)   │
│  • Client Encrypted Buckets (gs://consultx-client-vault/{companyId}/)  │
│  • 7-Year Statutory Audit Retention Policies                           │
│  • Presigned Secure Upload & Download Tokens                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ IAM Secret Access
┌───────────────────────────────────▼────────────────────────────────────┐
│ Layer 5: Secret Management & Banking Rail Security                     │
│  • GCP Secret Manager: consultx-bank-details (Investec 580105)         │
│  • GCP Secret Manager: paystack-secret-key, cipc-agent-credentials    │
│  • Dynamic Pro-Forma Invoice Generation & Real-time Webhooks           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Flagship Deep-Dive: Independent Business Valuations

Business Valuations represent our most detailed, knowledge-intensive service. Below is how the Delivery Engine manages its expanding knowledge, scope, documentation, and infrastructure.

### A. The Valuation Knowledge Base (`valuation-spec.ts`)
1. **Governing Standards**:
   - International Valuation Standards (IVS 2025).
   - SAICA Code of Professional Conduct for Chartered Accountants.
   - Companies Act 71 of 2008 Section 164 (Fair value dissenting shareholder provisions).
2. **Computational Methodologies**:
   - **Income Approach (DCF)**: 5-year discrete free cash flows to firm (FCFF) discounted at WACC; terminal value via Gordon Growth with reinvestment rate constraints.
   - **Market Approach**: Maintainable EBITDA multiples based on South African SME benchmarks (typically 3.5x to 7.5x depending on sector, turnover, and moat), adjusted for 20–30% Private Company Illiquidity Discount (DLOM).
   - **Asset Approach**: Adjusted Net Asset Value (NAV) evaluating tangibles and intangibles at net realizable value.
3. **Earnings Normalization Engine**:
   - Reversal of excess owner salaries and personal perks (vehicles, personal travel, mobile accounts).
   - Normalization of related-party rental arrangements to market rates.
   - Removal of non-recurring extraordinary items (litigation settlements, insurance payouts, COVID-19 relief).
4. **South African Risk-Adjusted WACC Build-up**:
   - $R_f$: South African 10-year sovereign bond yield (R2032/R2035).
   - Equity Risk Premium (ERP): 5.5% – 6.5%.
   - Small Stock Size Premium (SSSP): 2.0% – 5.0% depending on turnover bracket.
   - Company-Specific Risk Premium (CSRP): Probed via AnNa diagnostic (customer concentration, founder dependency).

### B. Standard Operating Procedure (6-Stage Delivery Pipeline)

| Stage | Owner | Action & Tasks | Deliverable / Output |
| :--- | :--- | :--- | :--- |
| **1. Intake & Scoping** | **Client & AnNa** | Client answers 3-step valuation diagnostic in chat (purpose, turnover scale, records quality); accepts indicative quote; signs digital mandate. | Valuation Brief Card & Digital Mandate |
| **2. Vault Ingestion** | **System Automation** | Client uploads 3-5 years AFS, YTD management accounts, trial balance, and share register into `gs://consultx-client-vault/{companyId}/valuations/`. | Completeness Score & Data Ingestion Pack |
| **3. Normalization Interview** | **Craig CA(SA)** | Craig conducts 45-min scoping interview with founder/CFO; identifies owner add-backs, replacement management cost, and customer concentration. | Agreed Add-Back Schedule & Working Papers |
| **4. Financial Modelling** | **Craig & Python Engine** | DCF model built in Excel/Python; WACC calculated; sensitivity matrix generated across growth and discount rates; multiple cross-check. | Interactive Model & Sensitivity Tables |
| **5. Report Drafting & Review** | **Craig CA(SA)** | Craig writes formal 25–40 page Valuation Report (macro context, company moat, financial analysis, methodology rationale, valuation conclusion). | Draft Valuation Report (PDF) |
| **6. Executive Delivery** | **Craig CA(SA)** | 60-min presentation meeting with directors; client sign-off; release of signed Valuation Certificate; 7-year archival in GCP. | Signed Valuation Certificate & Archive Pack |

---

## 4. Infrastructure Mapping: Where Each Component Lives

### A. Frontend Workspaces (`website/src/app/portal/`)
- `/portal/services/valuation/`: Specialized interactive valuation workspace:
  - Scoping questionnaire & transaction details.
  - Multi-file dropzone with live validation (AFS, trial balance, add-back schedule).
  - Status timeline: *Intake → Financials Uploaded → Scoping Call → Modelling → Draft Review → Final Delivery*.
  - Live preview of draft valuation metrics.
- `/portal/services/cipc/`: Specialized multi-company compliance dashboard (Turnover declaration, Beneficial Ownership cascade builder, statutory fees checkout).
- `/portal/services/tax/`: SARS tax health check & TCS PIN renewal center.

### B. Backend Services (`Cloud Run`)
1. **API Service (`api.consultx.co.za`)**:
   - Python FastAPI application running on Cloud Run.
   - Mounts secret `consultx-bank-details` from GCP Secret Manager.
   - Generates official PDF pro-forma invoices with Investec banking details and dynamic reference codes.
2. **Computational Workers**:
   - `worker-valuation`: Python microservice using NumPy/Pandas and OpenPyXL to ingest trial balances and populate standardized valuation financial model templates.
   - `worker-xbrl`: Python connector interfacing Iris Carbon API to tag AFS disclosures and run CIPC taxonomy validation rules.
   - `worker-cipc`: Headless browser automation worker for CIPC BizPortal / E-Services lodgment.

### C. Knowledge Base Repository (`website/src/lib/delivery-engine/`)
- A single source of truth for all service parameters:
  - `types.ts`: Universal interfaces for services, documents, workflows, and knowledge bases.
  - `valuation-spec.ts`: Complete Business Valuation delivery blueprint.
  - `cipc-spec.ts`: CIPC annual returns & beneficial ownership rules.
  - `tax-spec.ts`: SARS registration requirements and compliance criteria.
  - `cfo-spec.ts`: Fractional CFO deliverables and board pack standards.

---

## 5. Development Roadmap for Delivery Workspaces

```text
Phase 1: Delivery Engine Foundations (Completed)
 ├── 63-service unified rates schedule (RATES_SCHEDULE_2026)
 ├── AnNa AI multi-track intent routing (Track A, B, C, D)
 ├── Dual payments (Paystack modal + Investec Bank EFT)
 ├── Marketing /services page integration with direct portal links
 └── Delivery-engine types and Valuation specification (src/lib/delivery-engine/)

Phase 2: Formatted Service Delivery Portals (Next Sprint)
 ├── Dedicated /portal/services/valuation/ intake & review workspace
 ├── Dedicated /portal/services/cipc/ multi-company annual return tracker
 ├── Pre-flight document validation & OCR extraction in dropzones
 └── Automated Magic Return Link email dispatcher on SendGrid/Cloud Run

Phase 3: Computational Engine & Review Workbench
 ├── Valuation financial model generator (Python OpenPyXL / DCF template)
 ├── Craig's Operator Workbench (Review queue, approval checkpoints, status toggles)
 ├── Iris Carbon XBRL API connector integration
 └── CIPC BizPortal automation connector
```

---

*Approved for implementation across ConsultX digital platform and Cloud Run backend.*
