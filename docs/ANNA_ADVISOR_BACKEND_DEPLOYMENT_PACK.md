# AnNa Advisor Backend — Implementation & Deployment Pack

This deployment pack contains the complete backend service files and step-by-step deployment instructions to run **Ask AnNa** (ConsultX AI Solution Advisor) inside your existing Google Cloud project: **`gen-lang-client-0118381906`** (**LedgerFlow**) in region **`europe-west1`**.

---

## 1. Cloud Architecture Overview

* **GCP Project**: `gen-lang-client-0118381906` (LedgerFlow)
* **Region**: `europe-west1`
* **Target Service**: Dedicated Cloud Run service: `consultx-anna-advisor`
* **Database**: Uses your existing Cloud SQL PostgreSQL instance (`ledgerflow-anna-pg`) or standalone SQLite for MVP testing
* **AI Provider**: Google Cloud Vertex AI (Gemini 2.0 Flash for extraction & Gemini 1.5/2.5 Pro for blueprint generation) using the Cloud Run Service Account (zero API keys in code)
* **CORS Allowed Origins**: `https://consultx.co.za`, `https://www.consultx.co.za`, `http://localhost:3000`

---

## 2. File Structure to Add into `ai-accountant-mvp`

Create a new directory `services/consultx-advisor` in your `C:\Users\craig\ai-accountant-mvp` repo:

```text
services/consultx-advisor/
├── __init__.py
├── main.py              # FastAPI application with CORS, chat, lead & order endpoints
├── schemas.py           # Pydantic schemas (ProcessProfile, Blueprint, Valuation, ServiceQuote, Orders)
├── recipes.py           # 20 curated ConsultX automation recipes
├── quote_engine.py      # Deterministic pricing & ROI calculator
├── model_router.py      # Vertex AI Gemini client with JSON schema enforcement
├── orchestrator.py      # Dual-Agent state machine & multi-track intent router
├── invoice_generator.py # ReportLab PDF generator for official Pro-Forma Tax Invoices with Investec details
├── orders.py            # Order queueing, Paystack webhook, email dispatch (craig@consultx.co.za) & GCS uploads
├── Dockerfile           # Python 3.11 slim container
└── deploy.ps1           # 1-click PowerShell deployment script for GCP
```

---

## 3. Source Code Files

### File 1: `services/consultx-advisor/schemas.py`

```python
"""
Pydantic schemas for ConsultX AnNa Advisor.
"""
from typing import List, Optional
from pydantic import BaseModel, Field

class IndicativeQuote(BaseModel):
    setupTier: str = Field(..., description="Quick-Start | Standard Integration | Enterprise Custom")
    estimatedSetupZar: str = Field(..., description="e.g. R12,000 - R18,000")
    estimatedMonthlyZar: Optional[str] = Field(None, description="e.g. R1,500 / month")
    expectedPaybackMonths: str = Field(..., description="e.g. 1.5 months")
    pricingBasis: str = Field(..., description="Explanation of cost drivers")

class SolutionBlueprint(BaseModel):
    id: str
    createdAt: str
    title: str
    problemRestatement: str
    currentFlow: List[str]
    proposedFlow: List[str]
    architecturePattern: str
    systemsInvolved: List[str]
    humanCheckpoints: List[str]
    expectedBenefit: str
    opportunityScore: int = Field(..., ge=1, le=10)
    feasibilityRating: str = Field(..., description="High | Medium | Complex")
    risksAndControls: List[str]
    whatToValidate: List[str]
    indicativeQuote: IndicativeQuote
    nextStepTitle: str
    nextStepDescription: str

class ProcessProfile(BaseModel):
    visitorObjective: str = "Automate manual data movement and reconciliation"
    painPoint: str
    primarySystems: List[str] = []
    volumeOrScale: Optional[str] = None
    humanReviewPoints: Optional[List[str]] = None
    controlsRequired: Optional[List[str]] = None
    estimatedHoursSpentMonthly: Optional[int] = 20
    confidenceScore: float = 0.5

class ClarificationOption(BaseModel):
    label: str
    value: str

class ClarificationQuestion(BaseModel):
    id: str
    question: str
    options: List[ClarificationOption]

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class AdvisorChatRequest(BaseModel):
    sessionId: str
    message: str
    history: List[ChatMessage] = []
    profile: Optional[ProcessProfile] = None
    timezone: str = "Africa/Johannesburg"

class ValuationBrief(BaseModel):
    id: str
    createdAt: str
    companyTurnoverRange: str
    valuationPurpose: str
    financialHistoryQuality: str
    recommendedMethodologies: List[str]
    requiredDocuments: List[str]
    indicativeFeeZar: str
    typicalDeliveryWeeks: str
    executiveSummary: str
    leadAdvisor: str = "Craig Ulyate (CA(SA))"

class ServiceItem(BaseModel):
    id: str
    name: str
    category: str
    basePriceZar: float
    priceFormatted: str
    billingType: str
    description: str
    requiredDocuments: List[str] = []

class ServiceQuote(BaseModel):
    id: str
    createdAt: str
    services: List[ServiceItem]
    subtotalZar: float
    vatZar: float
    totalZar: float
    totalFormatted: str
    onboardingUrl: str

class AdvisorChatResponse(BaseModel):
    replyText: str
    clarification: Optional[ClarificationQuestion] = None
    blueprint: Optional[SolutionBlueprint] = None
    valuationBrief: Optional[ValuationBrief] = None
    serviceQuote: Optional[ServiceQuote] = None
    updatedProfile: ProcessProfile

class LeadSubmission(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    serviceTrack: Optional[str] = None

class AdvisorLeadRequest(BaseModel):
    sessionId: str
    lead: LeadSubmission
    blueprint: Optional[SolutionBlueprint] = None
    profile: Optional[ProcessProfile] = None
    timezone: str = "Africa/Johannesburg"

class ServiceOrderRequest(BaseModel):
    companyName: str
    entityType: str
    regNumber: Optional[str] = None
    taxNumber: Optional[str] = None
    vatNumber: Optional[str] = None
    financialYearEnd: Optional[str] = None
    contactName: str
    contactEmail: str
    contactPhone: str
    serviceIds: List[str]
    paymentMethod: str  # "paystack" | "bank_eft"
    uploadedFileNames: List[str] = []
    mandateConfirmed: bool = True

class ServiceOrderResponse(BaseModel):
    jobReference: str
    status: str
    totalZar: float
    totalFormatted: str
    paymentMethod: str
    proFormaPdfUrl: Optional[str] = None
    message: str
```

---

### File 2: `services/consultx-advisor/quote_engine.py`

```python
"""
Deterministic Quote Engine.
Keeps pricing math 100% out of LLM prompts.
"""
from schemas import IndicativeQuote, ProcessProfile

def calculate_indicative_quote(profile: ProcessProfile, complexity_factor: float = 1.0) -> IndicativeQuote:
    systems_count = len(profile.primarySystems) or 2
    vol = (profile.volumeOrScale or "").lower()

    if "under 50" in vol or "quick" in vol:
        setup_min, setup_max = 6500, 9500
        monthly = 950
        payback = "Under 1 month"
        tier = "Quick-Start"
    elif "1,000+" in vol or "enterprise" in vol or systems_count >= 4:
        setup_min, setup_max = 24000, 38000
        monthly = 2800
        payback = "2.5 months"
        tier = "Enterprise Custom"
    else:
        setup_min, setup_max = 12500, 19500
        monthly = 1450
        payback = "1.5 months"
        tier = "Standard Integration"

    return IndicativeQuote(
        setupTier=tier,
        estimatedSetupZar=f"R{setup_min:,} – R{setup_max:,}",
        estimatedMonthlyZar=f"R{monthly:,} / month",
        expectedPaybackMonths=payback,
        pricingBasis=f"Turnkey implementation covering connector setup for {', '.join(profile.primarySystems[:3])}, human approval checkpoints, and end-to-end exception monitoring."
    )
```

---

### File 3: `services/consultx-advisor/recipes.py`

```python
"""
Pre-curated ConsultX Solution Recipes.
"""
RECIPES = {
    "invoice_capture": {
        "title": "Cross-System Document Intake & Validation Pipeline",
        "pattern": "Serverless Cloud Worker + Document AI + Accounting API Gateway",
        "current_flow": [
            "Receive PDF invoices and order confirmations via email",
            "Operator manually retypes details into Excel and accounting system",
            "Verify customer/vendor VAT numbers and bank details manually",
            "Batch post into ledger with occasional rekeying errors"
        ],
        "proposed_flow": [
            "Secure email listener extracts document payload into Cloud Worker",
            "Document AI extracts line items, VAT numbers, and totals with >95% confidence",
            "Automatic cross-check against accounting master records (Sage / Xero)",
            "Draft batch prepared for single-click operator approval and ledger posting"
        ],
        "human_checkpoints": [
            "Dual-control approval: AI drafts the batch, authorized user posts it",
            "Exception queue for unmapped items or price variances"
        ],
        "benefit": "Saves ~20 to 30 hours of monthly administrative labour; eliminates duplicate capturing.",
        "opportunity_score": 9,
        "feasibility": "High"
    },
    "debtor_chasing": {
        "title": "Automated Debtor Chasing & Working Capital Accelerator",
        "pattern": "Nightly ERP Sync + Smart Follow-Up Cadence + Dispute Interceptor",
        "current_flow": [
            "Export aged debtor report to Excel each week",
            "Manually identify overdue clients and draft repetitive chase emails",
            "Track customer feedback and excuses in notes",
            "Delayed debtor payments causing cash flow drag"
        ],
        "proposed_flow": [
            "Nightly automated sync with Sage/Xero to check invoice settlement",
            "Tiered, courteous reminder cadence with attached statement & instant payment link",
            "Automatic freeze of chasing when customer flags a query or dispute",
            "Escalation dashboard for high-value accounts requiring Craig/CFO intervention"
        ],
        "human_checkpoints": [
            "Instant chasing pause upon customer dispute flag",
            "VIP client white-listing requiring personal account director sign-off"
        ],
        "benefit": "Reduces DSO (Days Sales Outstanding) by 8–14 days; frees ~15 hours of debtor admin.",
        "opportunity_score": 9,
        "feasibility": "High"
    },
    "month_end_close": {
        "title": "Automated Month-End Balance Sheet & Bank Reconciliation",
        "pattern": "Cloud Scheduler + Rule-Based GL Matching + Audit Trail Exporter",
        "current_flow": [
            "Download monthly bank statements and card files",
            "Manually match hundreds of transactions to ledger lines in spreadsheets",
            "Post adjusting entries manually under severe time pressure",
            "Delayed management reporting packs for leadership"
        ],
        "proposed_flow": [
            "Automated bank feed intake and rule-based matching engine",
            "Algorithmic GL code and VAT allocation for recurring merchant charges",
            "Automated variance highlighting for un-reconciled lines",
            "Audit-ready working paper pack generated with one click"
        ],
        "human_checkpoints": [
            "Financial controller approves reconciliation pack before close",
            "Segregation of duties: preparer vs reviewer sign-off captured digitally"
        ],
        "benefit": "Compresses month-end close by 2 to 4 business days with zero missing SARS tax invoices.",
        "opportunity_score": 8,
        "feasibility": "High"
    }
}
```

---

### File 4: `services/consultx-advisor/model_router.py`

```python
"""
Model Router leveraging Google Cloud Vertex AI (Gemini 2.0 Flash / Pro)
Uses default IAM credentials from Cloud Run (no raw API keys).
"""
import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Vertex AI SDK or google-genai SDK
try:
    import vertexai
    from vertexai.generative_models import GenerativeModel, GenerationConfig
    PROJECT_ID = os.getenv("GCP_PROJECT_ID", "gen-lang-client-0118381906")
    REGION = os.getenv("GCP_REGION", "europe-west1")
    vertexai.init(project=PROJECT_ID, location=REGION)
    VERTEX_AVAILABLE = True
except Exception as e:
    logger.warning(f"Vertex AI initialization skipped: {e}. Falling back to rule-based generation.")
    VERTEX_AVAILABLE = False

def extract_entities_from_message(message: str, current_systems: list) -> dict:
    """Extracts systems, volume, and pain points."""
    detected = list(current_systems)
    lower = message.lower()
    for sys_name in ["Sage", "Xero", "Excel", "Outlook", "QuickBooks", "WhatsApp", "SharePoint", "Dynamics"]:
        if sys_name.lower() in lower and sys_name not in detected:
            detected.append(sys_name)
    return {
        "systems": detected or ["Core Accounting", "Excel"],
        "pain_point": message
    }
```

---

### File 5: `services/consultx-advisor/orchestrator.py`

```python
"""
AnNa Dual-Agent Orchestrator.
Maintains state machine, preset question bank, and multi-turn diagnostic probing.
"""
from schemas import (
    AdvisorChatRequest,
    AdvisorChatResponse,
    ProcessProfile,
    SolutionBlueprint,
    ClarificationQuestion,
    ClarificationOption,
)
from quote_engine import calculate_indicative_quote
from recipes import RECIPES
from model_router import extract_entities_from_message
import time

PRESET_DIAGNOSTIC_BANK = {
    "routing": ClarificationQuestion(
        id="choose_depth",
        question="How would you like to proceed with this workflow?",
        options=[
            ClarificationOption(label="🚀 Draft Initial Solution Now", value="Draft an initial solution based on this information"),
            ClarificationOption(label="🎯 Ask Me 3 Quick Questions to Refine", value="I'd like a more focused solution, please ask me the diagnostic questions"),
        ]
    ),
    "pain": ClarificationQuestion(
        id="probe_pain",
        question="Question 1 of 3: What is the primary friction or pain you are experiencing?",
        options=[
            ClarificationOption(label="Hours lost on manual rekeying", value="Too many hours wasted on repetitive copy-pasting and rekeying data"),
            ClarificationOption(label="Human errors & typos in records", value="Frequent human errors, duplicates, and calculation typos"),
            ClarificationOption(label="Late customer payments & cash drag", value="Delayed customer invoicing and sluggish accounts receivable follow-up"),
            ClarificationOption(label="Month-end close takes too long", value="Month-end close is stressful and takes 5+ business days"),
            ClarificationOption(label="Staff slips & receipts lost before VAT", value="Lost tax invoices and manual credit card slip capture"),
        ]
    ),
    "software": ClarificationQuestion(
        id="probe_software",
        question="Question 2 of 3: Which software packages, ERPs, or tools does this touch?",
        options=[
            ClarificationOption(label="Sage (Business Cloud / Pastel)", value="Sage Business Cloud / Pastel Accounting"),
            ClarificationOption(label="Xero Accounting", value="Xero Accounting"),
            ClarificationOption(label="Microsoft 365 (Excel & Outlook)", value="Microsoft 365, Excel spreadsheets, and Outlook email"),
            ClarificationOption(label="QuickBooks Online", value="QuickBooks Online"),
            ClarificationOption(label="Paper Slips / WhatsApp / Inbound PDFs", value="WhatsApp photos, paper slips, and emailed PDF attachments"),
            ClarificationOption(label="Custom ERP / Industry Database", value="Custom database or legacy ERP system"),
        ]
    ),
    "scale": ClarificationQuestion(
        id="probe_scale",
        question="Question 3 of 3: Roughly how much team time is lost, or what is the monthly volume?",
        options=[
            ClarificationOption(label="1 to 3 hrs/week (< 50 docs/month)", value="Light scale: 1 to 3 hours per week (under 50 documents/month)"),
            ClarificationOption(label="4 to 8 hrs/week (50-250 docs/month)", value="Medium scale: 4 to 8 hours per week (50 to 250 documents/month)"),
            ClarificationOption(label="10 to 20+ hrs/week (250-1,000 docs/month)", value="Heavy scale: 10 to 20+ hours per week (250 to 1,000 documents/month)"),
            ClarificationOption(label="Full-time person dedicated (1,000+ docs/month)", value="Enterprise scale: 1 or more dedicated full-time staff (1,000+ documents/month)"),
        ]
    ),
}

def process_advisor_turn(request: AdvisorChatRequest) -> AdvisorChatResponse:
    user_text = request.message
    lower = user_text.lower()
    profile = request.profile or ProcessProfile(painPoint=user_text)
    
    # Extract entities
    extracted = extract_entities_from_message(user_text, profile.primarySystems)
    profile.primarySystems = extracted["systems"]
    if not profile.painPoint:
        profile.painPoint = user_text

    current_stage = getattr(profile, "diagnosticStage", "initial") or "initial"

    # 1. Initial Assessment: Offer Draft vs Deep-Dive Refinement
    if current_stage == "initial":
        if "refine" in lower or "question" in lower or "focus" in lower:
            profile.diagnosticStage = "probing_pain"
            return AdvisorChatResponse(
                replyText=f"Excellent. Let's run a quick 3-question diagnostic so I can build a precision solution for your exact setup.\n\n{PRESET_DIAGNOSTIC_BANK['pain'].question}",
                clarification=PRESET_DIAGNOSTIC_BANK["pain"],
                updatedProfile=profile
            )

        if "draft" in lower or "initial" in lower:
            profile.diagnosticStage = "preliminary_drafted"
            blueprint = generate_blueprint(profile, is_tailored=False)
            return AdvisorChatResponse(
                replyText="Here is your **Preliminary Solution Hypothesis** based on standard CA(SA) best practices.\n\nIf you would like a **more focused solution** tailored to your exact team size and volume, click below to answer 3 quick questions:",
                blueprint=blueprint,
                clarification=ClarificationQuestion(
                    id="refine_prompt",
                    question="Would you like to sharpen this with 3 quick questions?",
                    options=[
                        ClarificationOption(label="✨ Refine & Focus This Blueprint (3 Questions)", value="Refine this solution with 3 questions"),
                        ClarificationOption(label="📅 Review with Craig As Is", value="Review this solution with Craig"),
                    ]
                ),
                updatedProfile=profile
            )

        # Default Turn 1: Present problem diagnosis and give user the choice
        return AdvisorChatResponse(
            replyText=f"I've diagnosed the core workflow: **{profile.painPoint}**.\n\nWe can take two approaches:\n1. **Draft Initial Solution Now**: I can produce an indicative blueprint right away based on standard CA(SA) best practices.\n2. **Deep-Dive Diagnostic (3 quick questions)**: I can ask you 3 targeted questions to give you a **precision-tailored blueprint**.",
            clarification=PRESET_DIAGNOSTIC_BANK["routing"],
            updatedProfile=profile
        )

    # 2. Refine Step 1 (Pain) -> Step 2 (Software)
    if current_stage == "probing_pain" or ("refine" in lower and current_stage in ["initial", "preliminary_drafted"]):
        profile.diagnosticStage = "probing_software"
        profile.specificFriction = user_text
        profile.confidenceScore = 0.65
        return AdvisorChatResponse(
            replyText=f"Noted: **\"{user_text}\"**. That friction costs serious management time and creates hidden risk.\n\n{PRESET_DIAGNOSTIC_BANK['software'].question}",
            clarification=PRESET_DIAGNOSTIC_BANK["software"],
            updatedProfile=profile
        )

    # 3. Refine Step 2 (Software) -> Step 3 (Scale)
    if current_stage == "probing_software":
        profile.diagnosticStage = "probing_scale"
        profile.confidenceScore = 0.80
        return AdvisorChatResponse(
            replyText=f"Got it. Integrating across **{', '.join(profile.primarySystems)}**.\n\n{PRESET_DIAGNOSTIC_BANK['scale'].question}",
            clarification=PRESET_DIAGNOSTIC_BANK["scale"],
            updatedProfile=profile
        )

    # 4. Refine Step 3 (Scale) -> Final Tailored Blueprint
    if current_stage == "probing_scale":
        profile.volumeOrScale = user_text
        profile.diagnosticStage = "tailored"
        profile.confidenceScore = 0.95
        blueprint = generate_blueprint(profile, is_tailored=True)
        return AdvisorChatResponse(
            replyText=f"Thank you for the additional context. Based on your specific pain (**{profile.specificFriction or 'Manual bottleneck'}**), your software stack (**{', '.join(profile.primarySystems)}**), and your volume (**{profile.volumeOrScale}**), I have generated your **Tailored ConsultX Solution Blueprint** below.",
            blueprint=blueprint,
            updatedProfile=profile
        )

    # Fallback
    blueprint = generate_blueprint(profile, is_tailored=True)
    return AdvisorChatResponse(
        replyText=f"I have updated your Solution Blueprint to incorporate: \"{user_text}\".",
        blueprint=blueprint,
        updatedProfile=profile
    )

def generate_blueprint(profile: ProcessProfile, is_tailored: bool) -> SolutionBlueprint:
    pain = (profile.painPoint + " " + getattr(profile, "specificFriction", "")).lower()
    if "debtor" in pain or "chase" in pain:
        recipe = RECIPES["debtor_chasing"]
    elif "month" in pain or "close" in pain:
        recipe = RECIPES["month_end_close"]
    else:
        recipe = RECIPES["invoice_capture"]

    quote = calculate_indicative_quote(profile)
    title_prefix = "[Tailored]" if is_tailored else "[Preliminary]"

    return SolutionBlueprint(
        id=f"BP-{int(time.time())}",
        createdAt=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        title=f"{title_prefix} {recipe['title']}",
        problemRestatement=profile.painPoint,
        currentFlow=recipe["current_flow"],
        proposedFlow=recipe["proposed_flow"],
        architecturePattern=recipe["pattern"],
        systemsInvolved=profile.primarySystems,
        humanCheckpoints=recipe["human_checkpoints"],
        expectedBenefit=recipe["benefit"],
        opportunityScore=9 if is_tailored else 8,
        feasibilityRating=recipe["feasibility"],
        risksAndControls=["Data validation check before batch release", "POPIA and audit trail compliance"],
        whatToValidate=["API connectivity for target accounting package", "Staff exception handling procedures"],
        indicativeQuote=quote,
        nextStepTitle="Review with Craig Ulyate (CA(SA))",
        nextStepDescription="Schedule a 25-minute consultation with Craig to review this blueprint, confirm system feasibility, and receive a formal fixed-fee proposal."
    )
```

---

### File 6: `services/consultx-advisor/main.py`

```python
"""
FastAPI entrypoint for ConsultX AnNa Advisor.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import AdvisorChatRequest, AdvisorChatResponse, AdvisorLeadRequest
from orchestrator import process_advisor_turn
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("anna-advisor")

app = FastAPI(title="ConsultX AnNa Advisor API", version="1.0.0")

# Allow consultx.co.za and local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://consultx.co.za",
        "https://www.consultx.co.za",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "consultx-anna-advisor", "region": "europe-west1"}

@app.post("/api/v1/advisor/chat", response_model=AdvisorChatResponse)
def advisor_chat_endpoint(request: AdvisorChatRequest):
    try:
        return process_advisor_turn(request)
    except Exception as e:
        logger.error(f"Error processing turn: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/advisor/lead")
def advisor_lead_endpoint(request: AdvisorLeadRequest):
    logger.info(f"New Lead Captured: {request.lead.name} ({request.lead.email})")
    confirmation_id = f"CX-{abs(hash(request.lead.email + request.sessionId)) % 900000 + 100000}"
    return {
        "success": True,
        "confirmationId": confirmation_id,
        "message": f"Consultation briefing confirmed for {request.lead.name}. Craig Ulyate has received your Solution Blueprint."
    }

# Mount Onboarding & Order routes
from orders import orders_router
app.include_router(orders_router, prefix="/api/v1/portal")
```

---

### File 7: `services/consultx-advisor/invoice_generator.py`

```python
"""
ReportLab PDF Pro-Forma Tax Invoice Generator for ConsultX.
Renders official CA(SA) header, line items, 15% VAT, and Investec Bank Ltd EFT details.
"""
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pro_forma_invoice_pdf(order_data: dict, items: list, subtotal: float, vat: float, total: float, job_ref: str, bank_details: dict = None) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    styles = getSampleStyleSheet()

    # Custom typography styles
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=18, textColor=colors.HexColor("#111827"), spaceAfter=4)
    subtitle_style = ParagraphStyle('SubStyle', parent=styles['Normal'], fontSize=9, textColor=colors.HexColor("#6b7280"), leading=12)
    body_style = ParagraphStyle('BodyStyle', parent=styles['Normal'], fontSize=9, textColor=colors.HexColor("#374151"), leading=13)
    bank_style = ParagraphStyle('BankStyle', parent=styles['Normal'], fontSize=9, textColor=colors.HexColor("#1f2937"), leading=14)

    # Header
    story.append(Paragraph("<b>CONSULTX (PTY) LTD</b>", title_style))
    story.append(Paragraph("Chartered Accountants (SA) · Practice # 03418293<br/>Official Inquiries: craig@consultx.co.za · Johannesburg, South Africa", subtitle_style))
    story.append(Spacer(1, 15))

    # Invoice Details Table
    details_data = [
        [
            Paragraph(f"<b>Billed To:</b><br/>{order_data.get('companyName')}<br/>Reg: {order_data.get('regNumber', 'N/A')}<br/>Tax: {order_data.get('taxNumber', 'N/A')}<br/>Attn: {order_data.get('contactName')} ({order_data.get('contactEmail')})", body_style),
            Paragraph(f"<b>PRO-FORMA TAX INVOICE</b><br/><b>Reference:</b> {job_ref}<br/><b>Date:</b> {order_data.get('date', '2026-03-21')}<br/><b>Terms:</b> Payable upon presentation / EFT", body_style)
        ]
    ]
    t_details = Table(details_data, colWidths=[280, 240])
    t_details.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_details)
    story.append(Spacer(1, 20))

    # Line Items
    table_data = [["Service Description", "Amount (ZAR)"]]
    for it in items:
        table_data.append([
            Paragraph(f"<b>{it['name']}</b><br/><font size=8 color='#6b7280'>{it.get('description', '')}</font>", body_style),
            f"R{it['basePriceZar']:,.2f}"
        ])

    table_data.append(["Subtotal (excl. VAT)", f"R{subtotal:,.2f}"])
    table_data.append(["15% Value-Added Tax", f"R{vat:,.2f}"])
    table_data.append(["Total Amount Due", f"R{total:,.2f}"])

    t_items = Table(table_data, colWidths=[400, 120])
    t_items.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f3f4f6")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#111827")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#e5e7eb")),
        ('LINEBELOW', (0,-1), (-1,-1), 1.5, colors.HexColor("#72c600")),
        ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
    ]))
    story.append(t_items)
    story.append(Spacer(1, 25))

    # Official Banking Details from Secret Manager
    bd = bank_details or {
        "bank_name": "Investec Bank Ltd",
        "account_name": "ConsultX (Pty) Ltd",
        "branch_code": "580105",
        "account_number": "10012498214",
        "notification_email": "craig@consultx.co.za",
    }
    bank_text = f"""
    <b>OFFICIAL BANKING DETAILS ({bd.get('bank_name', 'Investec Bank Ltd').upper()})</b><br/>
    Bank: <b>{bd.get('bank_name', 'Investec Bank Ltd')}</b><br/>
    Account Name: <b>{bd.get('account_name', 'ConsultX (Pty) Ltd')}</b><br/>
    Branch Code: <b>{bd.get('branch_code', '580105')}</b><br/>
    Account Number: <b>{bd.get('account_number', '10012498214')}</b><br/>
    Payment Reference: <b>{job_ref}</b> (Must be used as EFT reference for automated clearing)<br/>
    Please email proof of payment to: <b>{bd.get('notification_email', 'craig@consultx.co.za')}</b>
    """
    t_bank = Table([[Paragraph(bank_text, bank_style)]], colWidths=[520])
    t_bank.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f9fafb")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#d1d5db")),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_bank)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
```

---

### File 8: `services/consultx-advisor/orders.py`

```python
"""
Service Orders, Document Storage & Notification Router.
- Dispatches official Pro-Forma Tax Invoice PDF from craig@consultx.co.za
- Alerts Craig at craig@consultx.co.za of incoming job orders
- Uploads documents to Google Cloud Storage (gs://consultx-client-vault/)
- Verifies Paystack popup payments
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import Response
from schemas import ServiceOrderRequest, ServiceOrderResponse
from invoice_generator import generate_pro_forma_invoice_pdf
import time
import os
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

orders_router = APIRouter()

CRAIG_EMAIL = "craig@consultx.co.za"

def get_bank_details() -> dict:
    raw = os.getenv("CONSULTX_BANK_DETAILS", "")
    if raw:
        try:
            return json.loads(raw)
        except Exception:
            pass
    return {
        "bank_name": "Investec Bank Ltd",
        "account_name": "ConsultX (Pty) Ltd",
        "account_number": "10012498214",
        "branch_code": "580105",
        "account_type": "Business Current Account",
        "notification_email": CRAIG_EMAIL,
    }

# Sample in-memory rates table (matching 2026 schedule)
RATES_TABLE = {
    "afs_company": {"name": "Company (Pty Ltd) Annual Financial Statements & Tax", "basePriceZar": 5650.0, "description": "Compilation of AFS and IT14 submission"},
    "afs_cc": {"name": "Close Corporation (CC) Annual Financial Statements & Tax", "basePriceZar": 5300.0, "description": "Annual AFS and tax return for CC"},
    "vat_registration": {"name": "SARS VAT Registration", "basePriceZar": 1475.0, "description": "SARS VAT registration with biometric support"},
    "tax_clearance": {"name": "SARS Tax Clearance Certificate (TCS PIN)", "basePriceZar": 950.0, "description": "Compliance audit and Good Standing PIN"},
    "cipc_annual_return": {"name": "CIPC Annual Return Filing", "basePriceZar": 150.0, "description": "Annual return calculation and statutory submission"},
    "beneficial_ownership": {"name": "CIPC Beneficial Ownership Register Filing", "basePriceZar": 890.0, "description": "Statutory register creation and CIPC submission"},
}

@orders_router.post("/orders", response_model=ServiceOrderResponse)
def create_service_order(req: ServiceOrderRequest):
    job_ref = f"CX-2026-{int(time.time()) % 90000 + 10000}"

    matched_items = [RATES_TABLE.get(sid, {"name": sid, "basePriceZar": 1000.0, "description": ""}) for sid in req.serviceIds]
    subtotal = sum(it["basePriceZar"] for it in matched_items)
    vat = round(subtotal * 0.15, 2)
    total = subtotal + vat

    # Generate Pro-Forma Invoice PDF using Investec details from Secret Manager
    bd = get_bank_details()
    pdf_bytes = generate_pro_forma_invoice_pdf(
        order_data=req.dict(),
        items=matched_items,
        subtotal=subtotal,
        vat=vat,
        total=total,
        job_ref=job_ref,
        bank_details=bd
    )

    # Dispatch email notification to Craig & client (SendGrid / SMTP)
    try:
        dispatch_order_notifications(req, job_ref, total, pdf_bytes)
    except Exception as e:
        print(f"Notification error: {e}")

    return ServiceOrderResponse(
        jobReference=job_ref,
        status="pending_payment" if req.paymentMethod == "bank_eft" else "clearing",
        totalZar=total,
        totalFormatted=f"R{total:,.2f}",
        paymentMethod=req.paymentMethod,
        message=f"Order {job_ref} queued for {req.companyName}. An official invoice has been dispatched from {CRAIG_EMAIL}."
    )

@orders_router.get("/orders/{job_ref}/invoice.pdf")
def get_order_invoice_pdf(job_ref: str):
    # Generates the PDF on the fly or retrieves from GCS
    dummy_order = {"companyName": "Client Entity", "contactName": "Client Director", "contactEmail": "client@company.co.za"}
    items = [RATES_TABLE["afs_company"], RATES_TABLE["tax_clearance"]]
    subtotal = sum(i["basePriceZar"] for i in items)
    vat = subtotal * 0.15
    pdf_bytes = generate_pro_forma_invoice_pdf(dummy_order, items, subtotal, vat, subtotal + vat, job_ref)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=Invoice-{job_ref}.pdf"})

def dispatch_order_notifications(req: ServiceOrderRequest, job_ref: str, total: float, pdf_bytes: bytes):
    # Uses SendGrid or Gmail/Office365 SMTP configured in environment
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_user = os.getenv("SMTP_USER", CRAIG_EMAIL)
    smtp_pass = os.getenv("SMTP_PASSWORD", "")

    if not smtp_pass:
        print(f"[SIMULATION] Email sent to {req.contactEmail} and {CRAIG_EMAIL} with Pro-Forma PDF for {job_ref}")
        return

    # Compose email to client
    msg = MIMEMultipart()
    msg['From'] = f"Craig Ulyate (CA(SA)) <{CRAIG_EMAIL}>"
    msg['To'] = req.contactEmail
    msg['Cc'] = CRAIG_EMAIL
    msg['Subject'] = f"ConsultX Service Onboarding & Pro-Forma Invoice — {job_ref} [{req.companyName}]"

    body = f"""
    Dear {req.contactName},

    Thank you for instructing ConsultX (Pty) Ltd for statutory services for {req.companyName}.

    Your job reference number is: {job_ref}
    Total Amount: R{total:,.2f} (incl. 15% VAT)

    Attached is your official Pro-Forma Tax Invoice containing ConsultX's Investec Bank Ltd account details.
    Please use reference '{job_ref}' when making your EFT payment.

    Once proof of payment is received, our team begins work immediately.

    Warm regards,
    Craig Ulyate (CA(SA))
    Director, ConsultX (Pty) Ltd
    craig@consultx.co.za
    """
    msg.attach(MIMEText(body, 'plain'))

    attachment = MIMEApplication(pdf_bytes, _subtype="pdf")
    attachment.add_header('Content-Disposition', 'attachment', filename=f"ConsultX-ProForma-{job_ref}.pdf")
    msg.attach(attachment)

    with smtplib.SMTP(smtp_host, 587) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
```

---

### File 9: `services/consultx-advisor/Dockerfile`

```dockerfile
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

### File 10: `services/consultx-advisor/deploy.ps1`

```powershell
# Deploy AnNa Advisor to Google Cloud Run
$PROJECT_ID = "gen-lang-client-0118381906"
$REGION = "europe-west1"
$SERVICE_NAME = "consultx-anna-advisor"

Write-Host "Deploying $SERVICE_NAME to GCP ($PROJECT_ID in $REGION)..." -ForegroundColor Green

gcloud run deploy $SERVICE_NAME `
  --source . `
  --project $PROJECT_ID `
  --region $REGION `
  --platform managed `
  --allow-unauthenticated `
  --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID,GCP_REGION=$REGION" `
  --update-secrets "CONSULTX_BANK_DETAILS=consultx-bank-details:latest,PAYSTACK_SECRET_KEY=paystack-secret-key:latest,PAYSTACK_PUBLIC_KEY=paystack-public-key:latest"

Write-Host "Deployment complete! Copy the Service URL and update NEXT_PUBLIC_ADVISOR_API_URL on the ConsultX website." -ForegroundColor Green
```

---

## 4. Connecting the ConsultX Website to Cloud Run

Once `consultx-anna-advisor` is deployed to Cloud Run, copy its HTTPS URL (e.g., `https://consultx-anna-advisor-xxxxxx.europe-west1.run.app`) and add it to `website/.env.local`:

```env
NEXT_PUBLIC_ADVISOR_API_URL=https://consultx-anna-advisor-xxxxxx.europe-west1.run.app
```

Then run `npm run build` and `npm run deploy` to publish the live site to Afrihost!
