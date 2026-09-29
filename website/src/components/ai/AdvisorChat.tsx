"use client";

import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { PUBLIC_CHAT_NOTICE, PUBLIC_CHAT_BLOCK_MESSAGE, containsSensitivePublicInput } from "@/lib/public-chat-safety";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  Copy,
  Check,
  PhoneCall,
  Mail,
} from "lucide-react";
import {
  Message,
  ProcessProfile,
  SolutionBlueprint,
  sendAdvisorTurn,
  submitAdvisorLead,
} from "@/lib/advisor-api";
import { BlueprintCard } from "./BlueprintCard";
import { ValuationBriefCard } from "./ValuationBriefCard";
import { ServiceQuoteCard } from "./ServiceQuoteCard";

interface AdvisorChatProps {
  initialPrompt?: string;
  onClose?: () => void;
  fullPage?: boolean;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

const STORAGE_KEY = "consultx_advisor_session_state";

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I am **AnNa**, ConsultX's AI Accountant and Business Solution Advisor.\n\nAsk me about:\n• **Workflow Automation**: System integrations, debtor chasing, and OCR pipelines.\n• **Business Valuations**: Independent DCF and EBITDA valuations led by Craig Ulyate (CA(SA)).\n• **Fixed-Price Compliance**: 2026 rates for Annual Financial Statements, SARS Tax, and CIPC filings.\n• **AnNa Expense**: AI receipt and slip intake via WhatsApp.",
  timestamp: new Date().toISOString(),
};

const SEED_PROMPTS = [
  "I want to assess automation opportunities across my business.",
  "I need an independent business valuation for my company.",
  "We copy orders from email into Excel and Sage every morning.",
  "How much does SARS VAT registration and tax clearance cost?",
  "Can we capture credit card slips via WhatsApp into Xero?",
];

export function AdvisorChat({
  initialPrompt,
  onClose,
  fullPage = false,
  isMaximized = false,
  onToggleMaximize,
}: AdvisorChatProps) {
  const router = useRouter();
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.sessionId) return parsed.sessionId;
        }
      } catch {
        // ignore
      }
    }
    return `sess_${Math.random().toString(36).substring(2, 11)}`;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
            return parsed.messages;
          }
        }
      } catch {
        // ignore
      }
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });
  const [inputText, setInputText] = useState("");
  const [privacyError, setPrivacyError] = useState("");
  const [selections, setSelections] = useState<string[]>([]);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<ProcessProfile>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.profile) return parsed.profile;
        }
      } catch {
        // ignore
      }
    }
    return {};
  });
  const [activeBlueprint, setActiveBlueprint] = useState<SolutionBlueprint | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.activeBlueprint) return parsed.activeBlueprint;
        }
      } catch {
        // ignore
      }
    }
    return null;
  });

  // Booking Modal State
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
  });
  const [bookingSubmitted, setBookingSubmitted] = useState<{
    success: boolean;
    confirmationId: string;
    message: string;
  } | null>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasTriggeredInitial = useRef(false);

  const scrollToBottom = () => {
    const stream = messagesEndRef.current?.parentElement;
    stream?.scrollTo({ top: stream.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            sessionId,
            messages,
            profile,
            activeBlueprint,
          })
        );
      } catch {
        // ignore
      }
    }
  }, [sessionId, messages, profile, activeBlueprint]);

  const handleResetChat = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    const newSessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
    setSessionId(newSessionId);
    setProfile({});
    setActiveBlueprint(null);
    setMessages([
      {
        ...DEFAULT_WELCOME_MESSAGE,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInputText("");
    setSelections([]);
    setPrivacyError("");
  };

  const handleGoFullscreen = () => {
    router.push("/advisor");
    if (onClose) {
      onClose();
    }
  };

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || inputText).trim();
      if (!query || isLoading) return;
      if (containsSensitivePublicInput(query)) {
        setPrivacyError(PUBLIC_CHAT_BLOCK_MESSAGE);
        return;
      }
      setPrivacyError("");

      setInputText("");
      setSelections([]);
      const userMsg: Message = {
        id: `usr_${Date.now()}`,
        role: "user",
        content: query,
        timestamp: new Date().toISOString(),
      };

      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setIsLoading(true);

      try {
        const response = await sendAdvisorTurn(sessionId, newHistory, query, profile);

        const assistantMsg: Message = {
          id: `asst_${Date.now()}`,
          role: "assistant",
          content: response.replyText,
          opportunities: response.opportunities,
          responseMode: response.responseMode,
          clarification: response.clarification,
          blueprint: response.blueprint,
          valuationBrief: response.valuationBrief,
          serviceQuote: response.serviceQuote,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setProfile(response.updatedProfile);
        if (response.blueprint) {
          setActiveBlueprint(response.blueprint);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Please try again";
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: "assistant",
            content: `I hit a momentary snag reaching the reasoning engine: ${errorMessage}.`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, isLoading, messages, profile, sessionId]
  );

  // Handle initial prompt if passed via query string or props
  useEffect(() => {
    if (initialPrompt && !hasTriggeredInitial.current) {
      hasTriggeredInitial.current = true;
      handleSend(initialPrompt);
    }
  }, [initialPrompt, handleSend]);



  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) return;
    if (containsSensitivePublicInput(Object.values(bookingForm).join("\n"))) {
      setPrivacyError(PUBLIC_CHAT_BLOCK_MESSAGE);
      return;
    }

    setIsSubmittingLead(true);
    try {
      const res = await submitAdvisorLead(
        sessionId,
        {
          ...bookingForm,
          serviceTrack: profile.track || "general",
        },
        activeBlueprint || undefined,
        profile as ProcessProfile
      );
      setBookingSubmitted(res);
    } catch (err) {
      console.error(err);
      setBookingSubmitted({
        success: false,
        confirmationId: "",
        message: "Failed to connect to the scheduling backend. Please email Craig directly at craig@consultx.co.za or via WhatsApp at +27 82 818 5760.",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const bookingModalTitle =
    profile.track === "valuation"
      ? "Schedule Valuation Scoping with Craig Ulyate (CA(SA))"
      : profile.track === "services"
      ? "ConsultX Statutory Services Consultation with Craig"
      : "Review this solution with Craig Ulyate (CA(SA))";

  const bookingModalSubtitle =
    profile.track === "valuation"
      ? "Complimentary 25-Minute Valuation Strategy Session"
      : "Complimentary 25-Minute Advisory Session";

  return (
    <div className={`flex min-h-0 flex-col overflow-hidden bg-white ${fullPage ? "h-[calc(100dvh-100px)]" : "h-full"}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-consultx-charcoal px-5 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-consultx-green text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              Ask AnNa <span className="rounded bg-consultx-green/20 px-1.5 py-0.2 text-[10px] text-consultx-green">AI assistant</span>
            </div>
            <p className="text-[11px] text-gray-300">ConsultX advisor · Supported by Craig Ulyate (CA(SA))</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* New / Reset Chat Button */}
          <button
            type="button"
            onClick={handleResetChat}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Start fresh conversation"
            aria-label="Start fresh conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {!fullPage && onToggleMaximize && (
            <button
              type="button"
              onClick={onToggleMaximize}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              title={isMaximized ? "Shrink drawer" : "Maximize drawer"}
              aria-label={isMaximized ? "Shrink drawer" : "Maximize drawer"}
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}

          {!fullPage && (
            <button
              type="button"
              onClick={handleGoFullscreen}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              title="Open full page /advisor"
              aria-label="Open full page advisor"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline text-[11px]">Fullscreen</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors ml-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-consultx-green-soft text-consultx-green-dark text-xs font-bold mt-1">
                A
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-consultx-black text-white rounded-br-none"
                  : "bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-none shadow-xs"
              }`}
            >
              <div className="space-y-2 break-words">
                <ReactMarkdown skipHtml components={{ p: ({children}) => <p className="whitespace-pre-wrap">{children}</p>, a: ({children}) => <span>{children}</span>, img: () => null }}>{m.clarification ? m.content.replace(m.clarification.question, "").trim() : m.content}</ReactMarkdown>
              </div>
              {m.responseMode && <p className="mt-2 text-[10px] text-gray-500">{m.responseMode === "offline" ? "Offline guidance · limited rule-based assessment; no actions executed" : "Live advisor"}</p>}
              {m.opportunities && m.opportunities.length > 0 && <div className="mt-3 space-y-2" aria-label="Candidate opportunities">
                {m.opportunities.map(o => <div key={o.title} className="rounded-lg border border-gray-200 bg-white p-3">
                  <strong>{o.title}</strong><p className="mt-1">Reported: {o.evidence}</p><p>Candidate: {o.benefit}</p><p>Effort: {o.effort}</p><p>To validate: {o.unknowns}</p>
                </div>)}
              </div>}

              {/* Dynamic Clarification Chips */}
              {m.clarification && (
                <div className="mt-3 pt-2.5 border-t border-gray-200/70">
                  {m.clarification.stepNumber && m.clarification.totalSteps && (
                    <div className="mb-1.5 inline-flex items-center gap-1 rounded-md bg-consultx-green-soft px-2 py-0.5 text-[10px] font-bold text-consultx-green-dark uppercase tracking-wider">
                      Step {m.clarification.stepNumber} of {m.clarification.totalSteps}: Scoping Diagnostic
                    </div>
                  )}
                  <p className="text-[11px] font-semibold text-gray-700 mb-1">
                    {m.clarification.question}
                  </p>
                  {m.clarification.subtext && (
                    <p className="text-[10px] text-gray-400 mb-2">{m.clarification.subtext}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    <p className="w-full text-gray-500">Choose {m.clarification.multiple ? "one or more options" : "an option"} or type your answer below.</p>
                    {m.clarification.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={m.clarification?.multiple ? selections.includes(opt.value) : undefined}
                        onClick={() => m.clarification?.multiple ? setSelections(values => values.includes(opt.value) ? values.filter(v => v !== opt.value) : [...values, opt.value]) : handleSend(opt.value)}
                        disabled={isLoading || m.id !== messages.at(-1)?.id}
                        className="rounded-full border border-consultx-green/40 bg-white px-3 py-1.5 text-[11px] font-medium text-consultx-charcoal hover:bg-consultx-green-soft aria-pressed:bg-consultx-green-soft aria-pressed:border-consultx-green disabled:opacity-50 hover:border-consultx-green transition-all shadow-xs"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {m.id === messages.at(-1)?.id && <div className="mt-2 flex flex-wrap gap-3">
                    <button type="button" disabled={isLoading} onClick={() => composerRef.current?.focus()} className="underline">Write my own answer</button>
                    <button type="button" disabled={isLoading} onClick={() => handleSend("Not sure")} className="underline">Not sure</button>
                    <button type="button" disabled={isLoading} onClick={() => handleSend("Skip for now")} className="underline">Skip for now</button>
                  </div>}
                </div>
              )}

              {/* Render Solution Blueprint Card */}
              {m.blueprint && (
                <BlueprintCard
                  blueprint={m.blueprint}
                  onBookReview={() => setShowBooking(true)}
                  onRefine={() =>
                    handleSend("I'd like a more focused solution, please ask me the diagnostic questions")
                  }
                />
              )}

              {/* Render Valuation Brief Card */}
              {m.valuationBrief && (
                <ValuationBriefCard
                  brief={m.valuationBrief}
                  onBookMeeting={() => setShowBooking(true)}
                />
              )}

              {/* Render Service Quote Card */}
              {m.serviceQuote && (
                <ServiceQuoteCard
                  quote={m.serviceQuote}
                  onTalkToCraig={() => setShowBooking(true)}
                />
              )}
            </div>

            {m.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs mt-1">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-consultx-green-soft text-consultx-green animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span>AnNa is analyzing and formulating recommendations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Seed Prompts (Visible on fresh session) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <p className="text-[11px] font-medium text-gray-400 mb-1.5">Or choose a starting topic:</p>
          <div className="flex flex-wrap gap-1.5">
            {SEED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-left rounded-lg bg-gray-50 border border-gray-200/80 px-2.5 py-1.5 text-[11px] text-gray-600 hover:bg-consultx-green-soft/60 hover:border-consultx-green transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="shrink-0 border-t border-gray-100 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p id="public-chat-notice" className="mb-2 text-[11px] text-gray-600">{PUBLIC_CHAT_NOTICE}</p>
        {privacyError && <p role="alert" className="mb-2 text-xs text-red-700">{privacyError}</p>}
        {selections.length > 0 && <p className="mb-2 text-xs">Selected: {selections.join(", ")}. Add details below, then send to continue.</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend([...selections, inputText].filter(Boolean).join("; "));
          }}
          className="flex items-center gap-2"
        >
          <textarea
            ref={composerRef}
            rows={2}
            aria-label="Your message to AnNa"
            aria-describedby="public-chat-notice"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={messages.at(-1)?.clarification?.inputPlaceholder || "Type your answer, ask a question, or correct earlier details…"}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:border-consultx-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-consultx-green"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!inputText.trim() && selections.length === 0)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-consultx-green text-white shadow-soft transition-all hover:bg-consultx-green-dark disabled:opacity-40"
            aria-label={selections.length ? "Continue with selected answers" : "Send message"}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-1.5 text-center text-[10px] text-gray-400">
          ConsultX (Pty) Ltd · Johannesburg, South Africa
        </p>
      </div>

      {/* Booking / Consultation Drawer Overlay */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-consultx-green-soft px-2 py-0.5 text-[10px] font-semibold text-consultx-green-dark">
                  {bookingModalSubtitle}
                </span>
                <h3 className="mt-1 text-base font-bold text-consultx-black">
                  {bookingModalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowBooking(false);
                  setBookingSubmitted(null);
                }}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {bookingSubmitted ? (
              <div className="mt-6 text-center">
                {bookingSubmitted.success ? (
                  <>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-consultx-green-soft text-consultx-green">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="mt-3 font-bold text-sm text-gray-900">Consultation Request Received</h4>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      Your reference ID is <strong className="text-consultx-black">{bookingSubmitted.confirmationId}</strong>.
                      {" "}{bookingSubmitted.message}
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={`https://wa.me/27828185760?text=${encodeURIComponent(`Hi Craig, I've submitted a consultation request via ConsultX (Ref: ${bookingSubmitted.confirmationId}). Looking forward to connecting!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20BA5C] transition-all shadow-xs"
                      >
                        <PhoneCall className="h-4 w-4" /> Message Craig on WhatsApp
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h4 className="mt-3 font-bold text-sm text-gray-900">Offline Guidance Preview</h4>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      {bookingSubmitted.message}
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={`https://wa.me/27828185760?text=${encodeURIComponent(`Hi Craig, I would like to schedule a consultation with ConsultX.\n\nName: ${bookingForm.name}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nCompany: ${bookingForm.company}\nNotes: ${bookingForm.notes || "None"}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#20BA5C] transition-all shadow-xs"
                      >
                        <PhoneCall className="h-4 w-4" /> WhatsApp Craig Directly (+27 82 818 5760)
                      </a>
                      <a
                        href={`mailto:craig@consultx.co.za?subject=${encodeURIComponent(`ConsultX Advisory Request - ${bookingForm.name}`)}&body=${encodeURIComponent(`Name: ${bookingForm.name}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nCompany: ${bookingForm.company}\nNotes: ${bookingForm.notes}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-consultx-green px-4 py-2.5 text-xs font-bold text-white hover:bg-consultx-green-dark transition-all shadow-xs"
                      >
                        <Mail className="h-4 w-4" /> Email Brief Directly (craig@consultx.co.za)
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const text = `ConsultX Advisory Request\nName: ${bookingForm.name}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nCompany: ${bookingForm.company}\nNotes: ${bookingForm.notes}`;
                          navigator.clipboard.writeText(text);
                          setCopiedBrief(true);
                          setTimeout(() => setCopiedBrief(false), 3000);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                      >
                        {copiedBrief ? <Check className="h-4 w-4 text-consultx-green" /> : <Copy className="h-4 w-4" />}
                        {copiedBrief ? "Copied to Clipboard!" : "Copy Request to Clipboard"}
                      </button>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowBooking(false);
                    setBookingSubmitted(null);
                  }}
                  className="mt-4 w-full rounded-xl bg-consultx-black py-2.5 text-xs font-semibold text-white hover:bg-gray-800"
                >
                  Return to Chat
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="mt-4 space-y-3 text-xs">
                <p className="text-gray-600">Contact details and a high-level business description only. Do not include documents, account details, payroll records or credentials.</p>
                {privacyError && <p role="alert" className="text-red-700">{privacyError}</p>}
                <div>
                  <label className="block font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-consultx-green focus:outline-none"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-consultx-green focus:outline-none"
                    placeholder="sarah@yourcompany.co.za"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      value={bookingForm.company}
                      onChange={(e) => setBookingForm({ ...bookingForm, company: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-consultx-green focus:outline-none"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-consultx-green focus:outline-none"
                      placeholder="082 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Optional Notes / Focus Area</label>
                  <textarea
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-consultx-green focus:outline-none"
                    placeholder="Any specific questions or deadlines for Craig?"
                  />
                </div>

                <p className="text-[10px] text-gray-400">
                  By booking, you agree to ConsultX storing this profile to prepare your consultation.
                </p>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full rounded-xl bg-consultx-green py-2.5 text-xs font-bold text-white shadow-soft hover:bg-consultx-green-dark disabled:opacity-50"
                  >
                    {isSubmittingLead ? "Submitting Request..." : "Confirm & Send Brief to Craig"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
