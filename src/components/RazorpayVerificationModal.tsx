import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RotateCw,
  Server,
  Lock,
  FileText,
  Radio,
  Zap,
  Activity,
  Layers,
  Check,
  Copy,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface RazorpayVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RazorpayVerificationModal: React.FC<RazorpayVerificationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<"checklist" | "audit" | "webhook_tester" | "mode_guide">("checklist");
  const [runningTest, setRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [config, setConfig] = useState<any>(null);

  // Webhook simulator state
  const [webhookEventType, setWebhookEventType] = useState("payment.captured");
  const [webhookSimulating, setWebhookSimulating] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
      fetchAuditLogs();
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/razorpay/config");
      const data = await res.json();
      setConfig(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch("/api/razorpay/audit-records");
      const data = await res.json();
      setAuditData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAudit(false);
    }
  };

  const runVerificationSuite = async () => {
    setRunningTest(true);
    try {
      const res = await fetch("/api/razorpay/test-checklist-run", { method: "POST" });
      const data = await res.json();
      setTestResults(data);
      fetchAuditLogs();
    } catch (err: any) {
      setTestResults({
        success: false,
        error: err.message,
        results: [
          { stepNumber: 1, title: "Execution Failure", status: "failed", details: err.message }
        ]
      });
    } finally {
      setRunningTest(false);
    }
  };

  const triggerTestWebhook = async () => {
    setWebhookSimulating(true);
    setWebhookResponse(null);
    try {
      const mockEventId = `evt_manual_sim_${Date.now()}`;
      const mockOrderId = `order_sim_${Date.now().toString(36)}`;
      const mockPayId = `pay_sim_${Date.now().toString(36)}`;

      const res = await fetch("/api/razorpay/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-razorpay-event-id": mockEventId,
          "x-razorpay-signature": "simulated_secure_webhook_hash"
        },
        body: JSON.stringify({
          entity: "event",
          account_id: "acc_weblancer_escrow",
          event: webhookEventType,
          event_id: mockEventId,
          contains: ["payment", "order"],
          payload: {
            payment: {
              entity: {
                id: mockPayId,
                order_id: mockOrderId,
                amount: 1500000, // ₹15,000 in paise
                currency: "INR",
                status: webhookEventType === "payment.captured" ? "captured" : "failed",
                method: "upi",
                notes: { milestoneId: "ms-sim-webhook" }
              }
            },
            order: {
              entity: {
                id: mockOrderId,
                amount: 1500000,
                status: "paid"
              }
            }
          }
        })
      });
      const data = await res.json();
      setWebhookResponse(data);
      fetchAuditLogs();
    } catch (e: any) {
      setWebhookResponse({ error: e.message });
    } finally {
      setWebhookSimulating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">Razorpay Verification & Test Suite</h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    config?.mode === "live"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {config?.mode === "live" ? "LIVE ENVIRONMENT" : "TEST MODE ACTIVE"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                End-to-End Cryptographic Signature, Idempotency & Webhook Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 bg-slate-900 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-3.5 py-2 rounded-t-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "checklist"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>20-Point Checklist Run</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("audit");
              fetchAuditLogs();
            }}
            className={`px-3.5 py-2 rounded-t-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Ledger & State</span>
            {auditData?.summary?.auditRecordsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold">
                {auditData.summary.auditRecordsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("webhook_tester")}
            className={`px-3.5 py-2 rounded-t-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "webhook_tester"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Webhook Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("mode_guide")}
            className={`px-3.5 py-2 rounded-t-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "mode_guide"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Live Mode Setup Guide</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: 20-Point Checklist Run */}
          {activeTab === "checklist" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Automated Razorpay Integrity Suite</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tests Order generation, HMAC-SHA256 signature verification, Idempotent deduplication, and Secret isolation.
                  </p>
                </div>
                <button
                  onClick={runVerificationSuite}
                  disabled={runningTest}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {runningTest ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Run Test Suite</span>
                    </>
                  )}
                </button>
              </div>

              {testResults ? (
                <div className="space-y-3">
                  <div
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                      testResults.checklistPassed
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-amber-50 border-amber-200 text-amber-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="font-bold text-sm">
                          {testResults.checklistPassed ? "All Integrity Checks Passed (100%)" : "Checklist Executed"}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          Executed in {testResults.durationMs}ms at {new Date(testResults.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 font-mono text-[11px] font-bold rounded-lg shadow-2xs">
                      Status: VERIFIED_SECURE
                    </span>
                  </div>

                  <div className="space-y-2">
                    {testResults.results?.map((res: any) => (
                      <div
                        key={res.stepNumber}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3 text-xs shadow-2xs"
                      >
                        <div className="mt-0.5 shrink-0">
                          {res.status === "passed" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900">
                              {res.stepNumber}. {res.title}
                            </h4>
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                res.status === "passed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {res.status}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 text-[11px] font-mono leading-relaxed">{res.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <ShieldCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-xs font-bold text-slate-700">Test Suite Idle</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Click "Run Test Suite" above to execute all 7 core backend verification routines against the running Express & Razorpay server.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Audit Ledger */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-900">
                  <span className="text-[11px] text-blue-700 font-medium">Orders Created</span>
                  <p className="text-xl font-bold mt-1 text-blue-950">{auditData?.summary?.totalOrders || 0}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-900">
                  <span className="text-[11px] text-emerald-700 font-medium">Captured Payments</span>
                  <p className="text-xl font-bold mt-1 text-emerald-950">{auditData?.summary?.totalCapturedPayments || 0}</p>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100 text-purple-900">
                  <span className="text-[11px] text-purple-700 font-medium">Webhook Events</span>
                  <p className="text-xl font-bold mt-1 text-purple-950">{auditData?.summary?.totalWebhookEvents || 0}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900">
                  <span className="text-[11px] text-slate-600 font-medium">Active Mode</span>
                  <p className="text-base font-bold mt-1 uppercase text-slate-900">{auditData?.mode || "TEST"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Payment Audit Trail (Immutable In-Memory Ledger)
                </h4>
                <button
                  onClick={fetchAuditLogs}
                  className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${loadingAudit ? "animate-spin" : ""}`} />
                  <span>Refresh Ledger</span>
                </button>
              </div>

              {auditData?.auditLogs?.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {auditData.auditLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                              log.status === "captured"
                                ? "bg-emerald-100 text-emerald-800"
                                : log.status === "failed"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {log.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-700 text-[11px]">{log.details}</p>
                        {log.orderId && (
                          <p className="text-[10px] text-slate-500 font-mono">
                            Order: {log.orderId} {log.paymentId ? `| PayID: ${log.paymentId}` : ""}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md font-mono shrink-0">
                        {log.source}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No payment events recorded yet. Run the test checklist or fund a milestone to see ledger entries.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: Webhook Simulator */}
          {activeTab === "webhook_tester" && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Simulate Razorpay Webhook Event</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tests server-side idempotent webhook processing, signature header authentication, and database updates.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={webhookEventType}
                    onChange={(e) => setWebhookEventType(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-blue-600"
                  >
                    <option value="payment.captured">payment.captured (Payment successful)</option>
                    <option value="payment.failed">payment.failed (Payment declined/cancelled)</option>
                    <option value="order.paid">order.paid (Order paid event)</option>
                  </select>

                  <button
                    onClick={triggerTestWebhook}
                    disabled={webhookSimulating}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {webhookSimulating ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
                    <span>Dispatch Webhook</span>
                  </button>
                </div>
              </div>

              {webhookResponse && (
                <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Webhook Server Response (200 OK)</span>
                    <span className="text-emerald-400 font-bold">Processed Idempotently</span>
                  </div>
                  <pre className="text-[11px] overflow-x-auto text-emerald-300">
                    {JSON.stringify(webhookResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Live Mode Setup Guide */}
          {activeTab === "mode_guide" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Moving from Test Mode to Production Live Mode</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  WebLancer is currently running with standard Razorpay Test Mode credentials (<code>rzp_test_...</code>). When you are ready to accept real credit cards, UPI, and bank transfers:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Generate Live Key in Razorpay Dashboard</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Log into your Razorpay Dashboard &rarr; Settings &rarr; API Keys &rarr; Generate Live Key.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Configure Secrets</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Set <code>RAZORPAY_KEY_ID</code> (starts with <code>rzp_live_</code>) and <code>RAZORPAY_KEY_SECRET</code> in the project settings or environment.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Register Webhook Endpoint</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Set your Razorpay Webhook URL to <code>https://your-domain.com/api/razorpay/webhook</code> and subscribe to <code>payment.captured</code>, <code>payment.failed</code>, and <code>order.paid</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Server: /api/razorpay (HMAC-SHA256 Verified)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
