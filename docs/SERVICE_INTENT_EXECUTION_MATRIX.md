# ConsultX 2026 Master Service Catalog, Intent Mapping & AnNa Execution Matrix

**Document Reference**: `docs/SERVICE_INTENT_EXECUTION_MATRIX.md`  
**Effective Date**: 2026 Financial Year  
**Author**: ConsultX (Pty) Ltd — Craig Ulyate (CA(SA))  
**Source Baseline**: `Examples/2026 Rates.xlsx` (Sheet `2026` & Sheet `Old`) & ConsultX Production Codebase  

---

## 1. System Architecture: The ConsultX Autonomous Client Pipeline

When a visitor interacts with ConsultX via **Ask AnNa AI** or the web portal, the interaction follows a standardized 8-step lifecycle:

```
[ Visitor / Client Query ]
           │
           ▼
[ Step 1: AnNa AI Disambiguation & Clarification ]
           │ (Confirms exact statutory or advisory scope, turnover tier, entity type)
           ▼
[ Step 2: Live In-Chat Scoping & Quote Card ]
           │ (Pulls exact 2026 rate + 15% VAT, displays timeline & required documents)
           ▼
[ Step 3: Dual Payment Options ]
           ├─ Option A: Paystack Modal Popup (Card / Ozow / Capitec Pay / Instant EFT)
           └─ Option B: Investec Bank EFT (Secure modal popup + Downloadable Pro-Forma Invoice PDF)
           │
           ▼
[ Step 4: Portal Handoff & Customer Onboarding ]
           │ (Deep-links to /portal/services/onboard?services=... with pre-populated cart)
           ▼
[ Step 5: Automated Customer Notification & Magic Return Link ]
           │ (Dispatches confirmation from craig@consultx.co.za with persistent resume token)
           ▼
[ Step 6: Document Upload & Automated Pre-Validation ]
           │ (Stores files in private GCS bucket `gs://consultx-client-vault/{companyId}/`)
           ▼
[ Step 7: Dual-Track Task Queue & Craig's CA(SA) Execution ]
           ├─ Automated Platform Actions (Status updates, compliance triggers, reminders)
           └─ Craig's Manual Actions (Trial balance review, adjustments, tax filing, CIPC submission)
           │
           ▼
[ Step 8: Deliverable Delivery & Statutory Archival ]
           (Signed AFS, CIPC filing confirmation, SARS TCS PIN uploaded to portal & emailed)
```

---

## 2. Official 2026 ConsultX Rates Schedule

*All prices are sourced directly from `Examples/2026 Rates.xlsx`.*

### A. Annual Financial Statements & Tax Returns
| Service ID | Service Name | Base Fee (Excl. VAT) | 15% VAT | Total (Incl. VAT) | Billing Basis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `afs_company` | Company (Pty Ltd) AFS & IT14 Corporate Tax | From R9,900.00 | R1,485.00 | **From R11,385.00** | Once-off |
| `afs_cc` | Close Corporation (CC) AFS & Corporate Tax | From R9,500.00 | R1,425.00 | **From R10,925.00** | Once-off |
| `afs_sole_prop` | Sole Proprietor Financial Statements & Income Tax | From R7,500.00 | R1,125.00 | **From R8,625.00** | Once-off |
| `afs_trust` | Trust Financial Statements & IT12TR Income Tax | From R9,900.00 | R1,485.00 | **From R11,385.00** | Once-off |
| `afs_partnership` | Partnership Financial Statements & Income Tax | From R9,000.00 | R1,350.00 | **From R10,350.00** | Once-off |
| `tax_individual_basic` | Individual Basic Income Tax Return (IRP5 only) | R950.00 | R142.50 | **R1,092.50** | Per submission |
| `tax_individual_complex` | Individual Income Tax (Multi-source / Rental / Capital Gains) | R1,850.00 | R277.50 | **R2,127.50** | Per submission |
| `cgt_addon` | Capital Gains Tax Calculation Add-on | From R1,500.00 | R225.00 | **From R1,725.00** | Per submission |

### B. Taxation Services & SARS Submissions
| Service ID | Service Name | Base Fee (Excl. VAT) | 15% VAT | Total (Incl. VAT) | Billing Basis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `vat_registration` | SARS VAT Registration | R1,500.00 | R225.00 | **R1,725.00** | Per application |
| `tax_clearance` | SARS Tax Clearance Certificate (TCS PIN / Good Standing) | R1,250.00 | R187.50 | **R1,437.50** | Per submission |
| `paye_registration` | SARS PAYE & UIF Registration | R1,250.00 | R187.50 | **R1,437.50** | Per application |
| `income_tax_reg` | SARS Income Tax Profile Registration & Public Officer | R1,250.00 | R187.50 | **R1,437.50** | Per application |
| `vat201_submission` | Submission of VAT201 via eFiling | R350.00 | R52.50 | **R402.50** | Per return |
| `emp201_monthly` | Submission of EMP201 via eFiling | R350.00 | R52.50 | **R402.50** | Per return |
| `provisional_tax_company` | SARS Provisional Tax Returns (IRP6 — 1st & 2nd Period) | R950.00 | R142.50 | **R1,092.50** | Per submission |
| `emp501_biannual` | Bi-Annual EMP501 Employer Reconciliation & IRP5s | From R2,500.00 | R375.00 | **From R2,875.00** | Per season (+R125/emp) |
| `tax_directives` | Application for SARS Tax Directives | R1,250.00 | R187.50 | **R1,437.50** | Per submission |
| `wca_return` | Submission of Annual WCA / COIDA Return of Earnings | R350.00 | R52.50 | **R402.50** | Per submission |
| `ui19_submission` | UI19 Submission at Department of Labour | R1,250.00 | R187.50 | **R1,437.50** | Per submission |
| `tax_advisory` | Specialist Tax Advisory & Strategy Consultation (Craig CA(SA)) | R1,500.00 | R225.00 | **R1,725.00** | Per hour |

### C. CIPC Compliance & Company Secretarial
| Service ID | Service Name | Base Fee (Excl. VAT) | 15% VAT | Total (Incl. VAT) | Billing Basis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cipc_annual_return` | CIPC Annual Return Filing (Admin Fee) | R850.00 | R127.50 | **R977.50** | Admin + CIPC fee at cost |
| `cipc_ar_tier1` | CIPC Annual Return (< R1 Million Turnover) | R470.00 | R70.50 | **R540.50** | Inclusive of base fee (R690 late) |
| `cipc_ar_tier2` | CIPC Annual Return (R1M to R10M Turnover) | R815.00 | R122.25 | **R937.25** | Inclusive of base fee (R1,000 late) |
| `cipc_ar_tier3` | CIPC Annual Return (R10M to R25M Turnover) | R3,375.00 | R506.25 | **R3,881.25** | Inclusive of base fee (R4,375 late) |
| `cipc_ar_tier4` | CIPC Annual Return (R25M+ Turnover) | R5,375.00 | R806.25 | **R6,181.25** | Inclusive of base fee (R6,500 late) |
| `cipc_ar_cc` | CIPC Annual Return (Close Corporation) | R375.00 | R56.25 | **R431.25** | Inclusive of base fee (R565 late) |
| `beneficial_ownership` | CIPC Beneficial Ownership (BO) Register Filing | R650.00 | R97.50 | **R747.50** | Per filing |
| `company_registration` | Private Company (Pty Ltd) Registration — Basic Standard MOI | R2,500.00 | R375.00 | **R2,875.00** | Once-off |
| `company_registration_complex`| Private Company Registration — Complex / Custom MOI | R3,500.00 | R525.00 | **R4,025.00** | Once-off |
| `name_reservation` | Company Name Reservation (COR9.1 / COR10.1) | R750.00 | R112.50 | **R862.50** | Per submission |
| `director_amendment` | CIPC Director Amendments & Statutory Resolutions (COR39) | R1,250.00 | R187.50 | **R1,437.50** | Per submission |
| `moi_amendment` | MOI Amendments / CC to Pty Ltd Conversion | R1,500.00 | R225.00 | **R1,725.00** | Per submission |
| `company_restoration` | CIPC Entity Restoration from Deregistration | R1,565.00 | R234.75 | **R1,799.75** | Per submission |
| `cipc_deregistration` | CIPC Voluntary Company Deregistration | R1,000.00 | R150.00 | **R1,150.00** | Per submission |
| `secretarial_maintenance`| Annual Company Secretarial Retainer | R3,500.00 | R525.00 | **R4,025.00** | Per year |
| `bee_certificate` | B-BBEE EME Sworn Affidavit & Turnover Verification | R1,250.00 | R187.50 | **R1,437.50** | Per certificate |
| `third_party_confirmation`| Written Confirmation / CA(SA) Auditor Letter to 3rd Parties | R1,250.00 | R187.50 | **R1,437.50** | Per letter |

### D. Monthly Bookkeeping & Payroll Packages
| Service ID | Service Name | Base Fee (Excl. VAT) | 15% VAT | Total (Incl. VAT) | Scope Limits & Details |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bookkeeping_essentials`| Monthly Bookkeeping — Essentials | R3,500.00 | R525.00 | **R4,025.00 / mo** | <= 120 bank lines, <= 25 invoices, basic P&L & BS |
| `bookkeeping_growth` | Monthly Bookkeeping — Growth | R6,500.00 | R975.00 | **R7,475.00 / mo** | <= 350 bank lines, <= 80 invoices, monthly pack, VAT201 |
| `bookkeeping_scale` | Monthly Bookkeeping — Scale | R12,000.00 | R1,800.00 | **R13,800.00 / mo** | <= 900 bank lines, close checklist, KPI pack, review call |
| `debtors_management` | Debtors Management & Automated Follow-Up | From R3,500.00 | R525.00 | **From R4,025.00 / mo** | Invoicing, customer statements, payment allocation |
| `payroll_monthly` | Monthly Payroll Processing & EMP201 | R900.00 base | R135.00 | **R1,035.00 base** | + R150/emp/month (excl VAT) for <= 20 staff |

### E. Independent Business Valuation & M&A Advisory (Track A)
| Service ID | Service Name | Indicative Fee (Excl. VAT) | 15% VAT | Total (Incl. VAT) | Scope & Methodology |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `valuation_express` | Express Valuation Diagnostic & Multiples Brief | R8,500.00 | R1,275.00 | **R9,775.00** | EBITDA multiple benchmarks + normalized earnings |
| `valuation_comprehensive`| Comprehensive CA(SA) Business Valuation Report | R22,500.00 | R3,375.00 | **R25,875.00** | Full DCF + EBITDA Multiple + Balance Sheet adjustments |
| `valuation_ma_advisory` | Transaction Advisory & Information Memorandum | From R45,000.00 | R6,750.00 | **From R51,750.00** | Buyout negotiation support, pitch deck, deal structuring |

---

## 3. End-to-End Service-to-Intent Execution Matrix

### Service 1: CIPC Annual Return Filing
- **Service ID**: `cipc_annual_return` (or `cipc_ar_tier1` to `cipc_ar_tier4`, `cipc_ar_cc`)
- **2026 Price**: From R470 to R5,375 (excl VAT) based on turnover tier, or R850 admin fee + CIPC statutory fee.

#### A. Likely Visitor Queries & Prompts
- *"I need to file my company annual return."*
- *"Can you help me submit my CIPC return?"*
- *"My company is in deregistration process with CIPC because I didn't file annual returns."*
- *"How much does it cost to do my annual return with CIPC?"*
- *"Where do I lodge my annual CIPC compliance?"*
- *"I received an SMS from CIPC saying my company will be deregistered in 30 days."*

#### B. AnNa Clarification & Disambiguation Action
1. **Disambiguation**: Check whether client means **CIPC Annual Return** (statutory compliance to keep the company registered) vs. **SARS Corporate Tax Return (IT14)**.
2. **Entity Check**: Confirm whether the entity is a **Private Company (Pty Ltd)** or a **Close Corporation (CC)**.
3. **Turnover Tier**: Ask for approximate annual turnover (Under R1M, R1M–R10M, R10M–R25M, or R25M+).
4. **Timing Check**: Verify if the filing month is current or if it is overdue (triggering late penalty fees).
5. **Beneficial Ownership Cross-Sell**: Alert the customer that CIPC now mandates an updated **Beneficial Ownership (BO) Register** before accepting annual returns.

#### C. In-Chat Scoping Questions
1. *"What is your company registration number (e.g., 2023/123456/07)?"*
2. *"What was your turnover for the preceding financial year?"*
3. *"Is your company currently in Active status or AR Deregistration Process?"*
4. *"Have you already filed your mandatory CIPC Beneficial Ownership Register for this year?"*

#### D. Live Quote Card & Pricing Breakdown
- **Base Fee**: R470.00 (under R1M turnover) or R850.00 (admin fee)
- **15% VAT**: R70.50 (or R127.50)
- **Total Payable**: R540.50 (or R977.50)
- **Estimated Turnaround**: 24–48 hours upon document receipt.

#### E. Dual Payment & Onboarding Handoff
- **Paystack Modal**: Pop up inline card / instant EFT payment directly in chat.
- **Investec Bank EFT**: Pop up modal with:
  - Bank: **Investec Bank Ltd**
  - Account Name: **ConsultX (Pty) Ltd**
  - Branch Code: **580105**
  - Reference: `CIPC-{RegNumberLast6}`
  - Button: *Download Pro-Forma Invoice PDF*
- **Portal Link**: Redirect to `/portal/services/onboard?services=cipc_annual_return,beneficial_ownership`.

#### F. Automated Customer Notification & Magic Return Link
- **Sender**: `craig@consultx.co.za` via SendGrid / Cloud Run
- **Subject**: `[Action Required] Upload Details for your CIPC Annual Return — ConsultX`
- **Email Content**:
  > Hi {ContactName},
  > 
  > Thank you for choosing ConsultX for your CIPC Annual Return. We have reserved your service request under reference **CX-CIPC-{TicketId}**.
  > 
  > To finalize the lodgment with CIPC, please use your private secure link below to upload your latest turnover figures and confirm director details:
  > 
  > 👉 **[Resume Onboarding & Upload Documents]({PortalResumeUrl})**
  > *(This secure link is tied to your email and does not require a password.)*
  > 
  > If you have any questions, reply directly to this email or speak with AnNa on the portal.
  > 
  > Kind regards,  
  > **Craig Ulyate (CA(SA))**  
  > ConsultX (Pty) Ltd | craig@consultx.co.za

#### G. Required Document Checklist & Validation
- **Latest signed Trial Balance or AFS extract** (PDF/Excel) -> *Auto-checks turnover match*.
- **CIPC Disclosure Certificate (COR14.3 / CK2)** -> *Auto-validates registration number format*.
- **Confirmation of active directors / members**.

#### H. Post-Payment Execution Workflow
1. **Automated Platform Steps**:
   - Webhook triggers `order.paid` on Cloud Run.
   - GCS folder `gs://consultx-client-vault/{company_reg}/cipc_returns/` created.
   - Task inserted into internal queue with priority `HIGH`.
   - Alert sent to `craig@consultx.co.za` with company reg, turnover tier, and payment status.
2. **Craig's CA(SA) Execution Steps**:
   - Log in to CIPC BizPortal / E-Services using certified agent credentials.
   - Reconcile declared turnover against financial statements or bank ledger.
   - File Financial Accountability Supplement (FAS) or upload AFS XBRL.
   - Pay statutory filing fees via ConsultX CIPC draw-down account.
   - Download official **CIPC Annual Return Filing Certificate**.
3. **Deliverable Release & Archival**:
   - Upload CIPC certificate into client's portal document vault.
   - Mark service status as `Completed` in portal.
   - Dispatched automated completion email with CIPC certificate attached.

---

### Service 2: CIPC Beneficial Ownership (BO) Register Filing
- **Service ID**: `beneficial_ownership`
- **2026 Price**: R650.00 (excl. VAT) | R747.50 (incl. VAT)

#### A. Likely Visitor Queries & Prompts
- *"I need to file my beneficial ownership register."*
- *"CIPC says I can't file my annual return without beneficial ownership."*
- *"What is the CIPC BO register and how do I submit it?"*
- *"Do you do beneficial ownership compliance for private companies?"*
- *"SARS/CIPC is penalizing me for beneficial ownership."*

#### B. AnNa Clarification & Disambiguation Action
1. **Statutory Context**: Explain that since the General Laws (Anti-Money Laundering and Combating Terrorism Financing) Amendment Act, every Pty Ltd and CC must submit a register of ultimate individual owners holding 5%+ equity or voting rights.
2. **Complexity Check**: Check if the company has direct individual shareholders or an indirect cascade (Trusts / holding companies).

#### C. In-Chat Scoping Questions
1. *"How many individual shareholders own 5% or more of the company?"*
2. *"Are any of the shareholders other companies or trusts?"*
3. *"Do you have certified ID copies and an up-to-date share register available?"*

#### D. Live Quote Card & Pricing Breakdown
- **Base Fee**: R650.00
- **15% VAT**: R97.50
- **Total Payable**: R747.50
- **Estimated Turnaround**: 24–48 hours.

#### E. Dual Payment & Onboarding Handoff
- Paystack inline modal or Investec Bank EFT Pro-Forma PDF.
- Onboarding route: `/portal/services/onboard?services=beneficial_ownership`.

#### F. Automated Customer Notification & Magic Return Link
- Email sent with checklist of required certified IDs and share register upload link.

#### G. Required Document Checklist & Validation
- **Latest signed Share Register or Share Certificates**.
- **Certified ID / Passport copies** of all 5%+ owners (certified within 3 months).
- **ConsultX Mandate / Power of Attorney** (digitally signed in portal).

#### H. Post-Payment Execution Workflow
1. **Automated Platform Steps**: System generates the CIPC-compliant Shareholder Cascade XML/JSON template.
2. **Craig's CA(SA) Execution Steps**: Review ownership tree to ensure 100% cascade down to natural persons; log into CIPC BO portal; lodge beneficial ownership declaration; download official **CIPC Beneficial Ownership Confirmation Certificate**.
3. **Deliverable Release**: Certificate posted to client's portal vault and emailed.

---

### Service 3: New Private Company (Pty Ltd) Registration
- **Service ID**: `company_registration` (Basic: R2,500) | `company_registration_complex` (Complex: R3,500)
- **2026 Price**: R2,500.00 (excl. VAT) | R2,875.00 (incl. VAT)

#### A. Likely Visitor Queries & Prompts
- *"I want to register a new company."*
- *"How do I register a Pty Ltd in South Africa?"*
- *"Can you incorporate my new business with CIPC?"*
- *"How fast can I get a company registration certificate (COR14.3)?"*
- *"I need a company with a tax number and bank account assistance."*

#### B. AnNa Clarification & Disambiguation Action
1. **Name Reservation**: Check if they already have an approved COR9.4 name reservation from CIPC or need ConsultX to submit 4 name choices.
2. **MOI Complexity**: Clarify if standard statutory MOI suffices or if custom clauses (pre-emption rights, veto powers, multiple share classes) are needed.
3. **Turnaround**: Highlight fast-track 48–72h turnaround with official COR14.3 certificate, share certificates, and SARS tax number.

#### C. In-Chat Scoping Questions
1. *"What are your top 4 preferred company names?"*
2. *"How many directors will be appointed?"*
3. *"What is the main business activity and registered office physical address?"*

#### D. Live Quote Card & Pricing Breakdown
- **Base Fee**: R2,500.00 (includes CIPC fee, name reservation, share register, tax number)
- **15% VAT**: R375.00
- **Total Payable**: R2,875.00

#### E. Dual Payment & Onboarding Handoff
- Paystack popup card/EFT or Investec Bank EFT Pro-Forma PDF.
- Onboarding route: `/portal/services/onboard?services=company_registration`.

#### F. Automated Customer Notification & Magic Return Link
- Magic link allows client to upload director IDs and residential utility bills when ready.

#### G. Required Document Checklist & Validation
- **Certified ID / Smart Card copies** for all directors (PDF, < 3 months old).
- **Proof of residential address** (utility bill / bank statement < 3 months).
- **Power of attorney authorizing incorporation**.

#### H. Post-Payment Execution Workflow
1. **Automated Platform Steps**: System validates director South African ID numbers via Luhn algorithm; queues name reservation.
2. **Craig's CA(SA) Execution Steps**: Reserve company name with CIPC; prepare Memorandum of Incorporation (COR15.1A); submit incorporation bundle; generate share certificates; verify SARS tax registration.
3. **Deliverable Release**: Client receives COR14.3 Registration Certificate, Memorandum of Incorporation, Share Certificates, and Income Tax Registration Letter.

---

### Service 4: SARS VAT Registration
- **Service ID**: `vat_registration`
- **2026 Price**: R1,500.00 – R1,750.00 (excl. VAT) | R1,725.00 (incl. VAT)

#### A. Likely Visitor Queries & Prompts
- *"I need to register my company for VAT."*
- *"How do I get a SARS VAT number?"*
- *"My client won't pay me until I provide a VAT number."*
- *"We reached R1 million turnover, how do we register for VAT?"*
- *"Can you help with voluntary VAT registration?"*

#### B. AnNa Clarification & Disambiguation Action
1. **Voluntary vs. Mandatory**: Clarify whether turnover exceeded R1,000,000 in the past 12 months (Mandatory) or exceeded R50,000 in the past 2–3 months (Voluntary).
2. **Biometric Requirement**: Explain that SARS requires biometric verification or virtual appointment for the Public Officer. ConsultX preps the full compliance bundle.

#### C. In-Chat Scoping Questions
1. *"What is your total taxable turnover over the past 3 months?"*
2. *"Do you have a dedicated business bank account with 3 months of bank statements?"*
3. *"Is your company tax return up to date?"*

#### D. Live Quote Card & Pricing Breakdown
- **Base Fee**: R1,500.00
- **15% VAT**: R225.00
- **Total Payable**: R1,725.00

#### E. Dual Payment & Onboarding Handoff
- Paystack popup card/EFT or Investec Bank EFT Pro-Forma PDF.
- Onboarding route: `/portal/services/onboard?services=vat_registration`.

#### F. Automated Customer Notification & Magic Return Link
- Magic link email provides a strict SARS-compliant document upload checklist.

#### G. Required Document Checklist & Validation
- **3 Months Bank Statements** with official bank electronic stamp showing R50k+ turnover.
- **Proof of Business Address** (lease agreement or municipal account < 3 months).
- **Public Officer Certified ID** and appointment resolution.
- **Signed Customer Invoices or Contracts** proving active trading.

#### H. Post-Payment Execution Workflow
1. **Automated Platform Steps**: Verify PDF bank statements for bank stamp and keyword markers; generate RAV01 application bundle.
2. **Craig's CA(SA) Execution Steps**: Audit proof of turnover; submit RAV01 via SARS eFiling Registered Tax Practitioner profile; handle SARS document requests / case allocations; attend virtual appointment if required.
3. **Deliverable Release**: Issue official **SARS VAT Registration Notice (VAT103)**.

---

### Service 5: SARS Tax Clearance Certificate (TCS PIN / Good Standing)
- **Service ID**: `tax_clearance`
- **2026 Price**: R1,250.00 (excl. VAT) | R1,437.50 (incl. VAT)

#### A. Likely Visitor Queries & Prompts
- *"I need a Tax Clearance Certificate for a tender."*
- *"How do I get a SARS TCS PIN?"*
- *"My bank needs proof of good standing with SARS."*
- *"Can you fix non-compliance so I can get my tax clearance?"*
- *"Our tax clearance expired, can you renew it today?"*

#### B. AnNa Clarification & Disambiguation Action
1. **Purpose**: Confirm whether the TCS PIN is for **Good Standing**, **Tender**, **Foreign Investment**, or **Emigration**.
2. **Pre-Audit**: Check whether there are outstanding VAT201, EMP201, or IT14 returns, or outstanding debt holding up clearance.

#### C. In-Chat Scoping Questions
1. *"What is your SARS Income Tax Reference Number?"*
2. *"Are there any known unsubmitted returns or outstanding debt with SARS?"*
3. *"What is the deadline for your tender or bank request?"*

#### D. Live Quote Card & Pricing Breakdown
- **Base Fee**: R1,250.00
- **15% VAT**: R187.50
- **Total Payable**: R1,437.50
- **Turnaround**: Same-day if compliant; 2–3 days if returns require unblocking.

#### E. Dual Payment & Onboarding Handoff
- Paystack popup card/EFT or Investec Bank EFT Pro-Forma PDF.
- Onboarding route: `/portal/services/onboard?services=tax_clearance`.

#### F. Automated Customer Notification & Magic Return Link
- Dispatches authorization mandate form to link ConsultX as tax practitioner.

#### G. Required Document Checklist & Validation
- **Company registration number & Tax reference number**.
- **Signed SARS Tax Practitioner Mandate / Authorization Letter**.
- **Certified ID of Representative Director**.

#### H. Post-Payment Execution Workflow
1. **Automated Platform Steps**: System connects to eFiling practitioner profile; triggers automated SARS compliance dashboard audit.
2. **Craig's CA(SA) Execution Steps**: Review eFiling statement of account; resolve any outstanding returns or administrative penalties; request official Tax Compliance Status PIN.
3. **Deliverable Release**: Generate and upload official **SARS Tax Compliance Status PIN Document**.

---

### Service 6: Company (Pty Ltd) Annual Financial Statements & IT14 Corporate Tax
- **Service ID**: `afs_company`
- **2026 Price**: From R9,900.00 (excl. VAT) | From R11,385.00 (incl. VAT)

#### A. Likely Visitor Queries & Prompts
- *"I need annual financial statements for my company."*
- *"Can you prepare my year-end financials and submit the IT14 to SARS?"*
- *"My bank is asking for signed AFS compiled by an accountant."*
- *"What are your fees for company AFS and tax returns?"*
- *"We need audited or independently reviewed financials."*

#### B. AnNa Clarification & Disambiguation Action
1. **Accounting Framework**: Confirm if compilation under IFRS for SMEs is required.
2. **Public Interest Score (PI Score)**: Evaluate whether the company requires a **Compilation Report** (PI < 100 / owner-managed), an **Independent Review**, or an **Audit**.
3. **State of Books**: Clarify whether the client has an up-to-date trial balance in Xero/Sage or requires catch-up bookkeeping.

#### C. In-Chat Scoping Questions
1. *"What was your turnover and asset value for the financial year?"*
2. *"Is your bookkeeping currently reconciled in Xero, Sage, or QuickBooks?"*
3. *"What is your financial year-end month (e.g., February, December)?"*

#### D. Live Quote Card & Pricing Breakdown
- **Base Fee**: From R9,900.00 (standard SME compilation + IT14)
- **15% VAT**: R1,485.00
- **Total Payable**: From R11,385.00
- **Turnaround**: 5–10 business days from receipt of complete trial balance.

#### E. Dual Payment & Onboarding Handoff
- Paystack popup card/EFT or Investec Bank EFT Pro-Forma PDF.
- Onboarding route: `/portal/services/onboard?services=afs_company`.

#### F. Automated Customer Notification & Magic Return Link
- Email sent with secure link to upload trial balance, prior year financials, and bank statements.

#### G. Required Document Checklist & Validation
- **Latest signed Trial Balance** or detailed general ledger extract.
- **Prior year signed Annual Financial Statements**.
- **Year-end month bank statement** and loan account confirmations.
- **Fixed asset register / additions invoices**.

#### H. Post-Payment Execution Workflow
1. **Automated Platform Steps**: System validates trial balance debits and credits balance; provisions secure accounting workpaper directory in GCS.
2. **Craig's CA(SA) Execution Steps**: Perform accounting adjustments (depreciation, tax accruals, deferrals, director loan reconciliations); compile full AFS including Statement of Financial Position, P&L, Statement of Changes in Equity, Cash Flows, and Accounting Policies; prepare and lodge SARS IT14 Corporate Tax return; issue CA(SA) Accounting Officer / Compilation Report.
3. **Deliverable Release**: Signed AFS PDF and SARS IT14 submission receipt published to portal vault.

---

### Service 7: Monthly Bookkeeping & Management Accounts
- **Service ID**: `bookkeeping_essentials` (R3,500/mo) | `bookkeeping_growth` (R6,500/mo) | `bookkeeping_scale` (R12,000/mo)

#### A. Likely Visitor Queries & Prompts
- *"I need a monthly bookkeeper for my small business."*
- *"Can ConsultX manage our Xero or Sage accounts every month?"*
- *"We need monthly management reports and VAT submissions."*
- *"How much do you charge for outsourced bookkeeping?"*
- *"I have a backlog of 6 months of bank statements to reconcile."*

#### B. AnNa Clarification & Disambiguation Action
1. **Transaction Volume Tiering**:
   - *Essentials (R3,500/mo)*: Micro / startup (up to 120 bank lines, 25 invoices).
   - *Growth (R6,500/mo)*: Small SME (up to 350 bank lines, 80 invoices, monthly pack, VAT201).
   - *Scale (R12,000/mo)*: Busy SME (up to 900 bank lines, close checklist, KPI pack, review call).
2. **Catch-up Backlog**: Clarify whether historical months need catch-up reconciliation.

#### C. In-Chat Scoping Questions
1. *"Which accounting software do you use (Xero, Sage Business Cloud, QuickBooks)?"*
2. *"Roughly how many bank transactions do you have across all business accounts per month?"*
3. *"Do you require VAT201 submissions and monthly management commentary?"*

#### D. Live Quote Card & Pricing Breakdown
- **Essentials**: R3,500.00/mo + VAT (R4,025.00 incl. VAT)
- **Growth**: R6,500.00/mo + VAT (R7,475.00 incl. VAT)
- **Scale**: R12,000.00/mo + VAT (R13,800.00 incl. VAT)

#### E. Dual Payment & Onboarding Handoff
- Setup recurring monthly retainer mandate via Paystack subscription or Investec monthly EFT schedule.
- Onboarding route: `/portal/services/onboard?services=bookkeeping_growth`.

#### F. Automated Customer Notification & Magic Return Link
- Email sent requesting user invitation to Xero/Sage and bank feed authorization.

#### G. Required Document Checklist & Validation
- **Accountant access to Xero / Sage**.
- **Monthly bank statements / active bank feed**.
- **Supplier invoice access / AnNa Expense slip capture setup**.

#### H. Post-Payment Execution Workflow
1. **Automated Platform Steps**: Daily bank feed sync validation; automated slip extraction via AnNa OCR.
2. **Craig's CA(SA) Execution Steps**: Reconcile bank accounts, debtor ledgers, and creditor ledgers; conduct monthly adjustments; compile Monthly Management Pack (P&L, Balance Sheet, Cash Flow Summary); submit VAT201 returns.
3. **Deliverable Release**: Monthly management pack dispatched on the 10th of every month.

---

### Service 8: Specialist Business Valuation & M&A Advisory (Track A)
- **Service ID**: `valuation_express` (R8,500) | `valuation_comprehensive` (R22,500) | `valuation_ma_advisory` (From R45,000)

#### A. Likely Visitor Queries & Prompts
- *"I want to value my business."*
- *"How much is my company worth?"*
- *"We are doing a shareholder buyout and need an independent valuation."*
- *"I am planning to sell my business in the next 12 months."*
- *"I need a formal valuation report signed by a CA(SA) for investors."*

#### B. AnNa Clarification & Disambiguation Action
1. **Transaction Purpose**: Disambiguate context (Sale of business, Partner buyout, Raising capital / Pitch deck, Estate duty, or Shareholder dispute).
2. **Methodology Selection**: Explain CA(SA) valuation frameworks (Discounted Cash Flow, Maintainable EBITDA Multiples, Adjusted Net Asset Value).
3. **Data Availability**: Confirm availability of 3 years of historical AFS and future cash flow budgets.

#### C. In-Chat Scoping Questions
1. *"What is the primary purpose of the valuation?"*
2. *"What is your current annual turnover (Under R5M, R5M–R25M, R25M–R100M, R100M+)?"*
3. *"Are owner salaries and personal expenses clearly separable from operating earnings?"*

#### D. Live Valuation Brief Card
- Displays Recommended Methodologies, Historical Earnings Analysis, Indicative Fee (R22,500 + VAT), and Lead Advisor: **Craig Ulyate (CA(SA))**.

#### E. Consultation & Payment Handoff
- Direct scheduling link for a 30-minute Pre-Valuation Scoping Call with Craig, followed by formal engagement letter and Investec deposit.

#### F. Automated Customer Notification
- Summary valuation brief dispatched to customer and pre-call brief sent to `craig@consultx.co.za`.

#### G. Required Document Checklist
- **3 years signed Annual Financial Statements**.
- **Latest 12-month management accounts & trial balance**.
- **Budget / financial projections for the next 1–3 years**.
- **Details of owner compensation, perks, and non-recurring expenses**.

#### H. Execution Workflow
1. **Craig's CA(SA) Execution Steps**: Normalize EBITDA (adjust for owner perks, non-market rents, extraordinary items); build Discounted Cash Flow (DCF) model and WACC cost of capital analysis; apply South African industry peer multiples; draft formal signed **Independent Valuation Report**.
2. **Deliverable Release**: Formal presentation meeting with directors followed by delivery of signed valuation certificate.

---

## 4. Banking & Payment Integration Specifications

### Investec Bank Credentials & Secret Storage
- **Bank**: Investec Bank Ltd
- **Account Name**: ConsultX (Pty) Ltd
- **Branch Code**: `580105`
- **GCP Secret Name**: `consultx-bank-details` in project `gen-lang-client-0118381906`
- **Security Control**: Bank details are stored in GCP Secret Manager and dynamically populated into the server-rendered PDF pro-forma invoice and client modal. They are never hardcoded in plaintext client bundles.

### Paystack Modal Integration
- Public Key dynamically pulled from runtime config.
- Supports South African payment rails:
  - Visa / Mastercard Credit & Debit
  - Instant EFT (Capitec Pay, Ozow, Stitch)
  - SnapScan & Masterpass

---

## 5. Summary of Customer & Operator Notifications

| Event Trigger | Recipient | Sender | Payload Content |
| :--- | :--- | :--- | :--- |
| **New Service Quote Generated** | Client | AnNa AI | Quote ID, itemized 2026 rates, VAT breakdown, link to onboarding portal |
| **Investec EFT Option Selected** | Client | `craig@consultx.co.za` | Downloadable Pro-Forma Invoice PDF, Investec banking details, reference code |
| **Onboarding Started (Incomplete Docs)** | Client | `craig@consultx.co.za` | **Magic Return Link** with persistent token allowing upload resumption |
| **Payment Confirmed (Paystack or EFT)** | Client & Craig | System / Paystack | Receipt, paid tax invoice, queue ticket reference, assigned turnaround time |
| **New Job Queued for Execution** | Craig (`craig@consultx.co.za`) | System Alert | Company name, registration number, service requested, paid amount, client documents link |
| **Service Completed & Filed** | Client | `craig@consultx.co.za` | Statutory certificate (CIPC / SARS TCS / AFS), portal archival link |

---

*End of Specification — Approved for Production Execution across ConsultX Portal & Ask AnNa AI Advisor.*
